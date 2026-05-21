import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Award, 
  Flame, 
  Sparkles, 
  Info, 
  Clock, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Volume2,
  Heart,
  ArrowLeft,
  Settings,
  Plus,
  Youtube,
  Link
} from 'lucide-react';

interface AudioHabitPlayerProps {
  onBack: () => void;
  onReward: (points: number) => void;
  currentPoints: number;
}

interface CustomPreset {
  id: string;
  name: string;
  emoji: string;
  titleRu: string;
  hours: number;
  minutes: number;
  seconds: number;
}

interface MediaSource {
  type: 'playlist' | 'video';
  id: string;
  rawUrl: string;
  name: string;
}

const PRESET_SOURCES: MediaSource[] = [
  {
    type: 'playlist',
    id: 'PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ',
    rawUrl: 'https://youtube.com/playlist?list=PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ&si=-u60_yiG5NeTyqqU',
    name: 'Картинка на немецком 🖼️'
  },
  {
    type: 'playlist',
    id: 'PL0Ma0Xw0pXK8d5TFixtV7N26nT1cIrx4E',
    rawUrl: 'https://youtube.com/playlist?list=PL0Ma0Xw0pXK8d5TFixtV7N26nT1cIrx4E&si=rlFmOKLpvf19Y889',
    name: 'Диалог на немецком 💬'
  },
  {
    type: 'playlist',
    id: 'PL0Ma0Xw0pXK8-ShsyMq-Ywps5I91Inejs',
    rawUrl: 'https://youtube.com/playlist?list=PL0Ma0Xw0pXK8-ShsyMq-Ywps5I91Inejs&si=i5VKRS4F9Z_ewzFk',
    name: 'Письмо на немецком ✉️'
  }
];

const DEFAULT_PRESETS: CustomPreset[] = [
  {
    id: 'teeth',
    name: 'Zähneputzen',
    emoji: '🪥',
    titleRu: 'Зубная щетка',
    hours: 0,
    minutes: 2,
    seconds: 0
  },
  {
    id: 'massage',
    name: 'Gesichtsmassage',
    emoji: '🧘',
    titleRu: 'Лицевой массаж',
    hours: 0,
    minutes: 15,
    seconds: 0
  },
  {
    id: 'eggs',
    name: 'Frühstück',
    emoji: '🍳',
    titleRu: 'Яйца на пару',
    hours: 0,
    minutes: 10,
    seconds: 0
  }
];

export function AudioHabitPlayer({ onBack, onReward, currentPoints }: AudioHabitPlayerProps) {
  // Views: 'setup' (image-style timer setup) or 'player' (active playback)
  const [viewState, setViewState] = useState<'setup' | 'player'>('setup');
  
  // Custom Time Wheels (Hours, Minutes, Seconds)
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(2);
  const [seconds, setSeconds] = useState<number>(0);
  
  // List of presets matching the image bottom circles
  const [presets, setPresets] = useState<CustomPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('teeth');

  // Active YouTube Custom Source State
  const [mediaSource, setMediaSource] = useState<MediaSource>(() => {
    const saved = localStorage.getItem('yt_custom_source');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const oldIds = [
          'PL0Ma0Xw0pXK-X9ruIAww-vYRF8LpyF19y',
          'PL0Ma0Xw0pXK-X9ruIAww-vYRF8LpyF19Y',
          'PLs7zOCPlL6kvN6qE7tWre-Z01X3Pq7V_0',
          'PLk1fi_OPm9nK_Q6uN0n3e_FByfG31A8Bw'
        ];
        if (parsed && oldIds.includes(parsed.id)) {
          localStorage.setItem('yt_custom_source', JSON.stringify(PRESET_SOURCES[0]));
          return PRESET_SOURCES[0];
        }
        return parsed;
      } catch (e) {}
    }
    return PRESET_SOURCES[0];
  });

  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [customInputName, setCustomInputName] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  // Countdown State
  const [duration, setDuration] = useState<number>(120);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Stats
  const [streak, setStreak] = useState<number>(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string>('');
  
  // YouTube State
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('Загрузка немецкого трека...');
  const [volume, setVolume] = useState<number>(50);

  const playerRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const customModalRef = useRef<boolean>(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);

  // New Custom Preset Form
  const [newPresetTitle, setNewPresetTitle] = useState('');
  const [newPresetEmoji, setNewPresetEmoji] = useState('⏱️');
  const [newPresetMin, setNewPresetMin] = useState(5);

  // Scrolling/Dragging Refs and Event Handlers
  const hoursColRef = useRef<HTMLDivElement>(null);
  const minutesColRef = useRef<HTMLDivElement>(null);
  const secondsColRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef<{ y: number; val: number; type: 'hours' | 'minutes' | 'seconds' } | null>(null);

  // Wheel active listener to prevent window scroll on trackpad/mouse scroll
  useEffect(() => {
    const handleWheelHours = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setHours(prev => (prev + 1) % 24);
      } else if (e.deltaY < 0) {
        setHours(prev => (prev + 23) % 24);
      }
    };

    const handleWheelMinutes = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setMinutes(prev => (prev + 1) % 60);
      } else if (e.deltaY < 0) {
        setMinutes(prev => (prev + 59) % 60);
      }
    };

    const handleWheelSeconds = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setSeconds(prev => (prev + 1) % 60);
      } else if (e.deltaY < 0) {
        setSeconds(prev => (prev + 59) % 60);
      }
    };

    const hEl = hoursColRef.current;
    const mEl = minutesColRef.current;
    const sEl = secondsColRef.current;

    hEl?.addEventListener('wheel', handleWheelHours, { passive: false });
    mEl?.addEventListener('wheel', handleWheelMinutes, { passive: false });
    sEl?.addEventListener('wheel', handleWheelSeconds, { passive: false });

    return () => {
      hEl?.removeEventListener('wheel', handleWheelHours);
      mEl?.removeEventListener('wheel', handleWheelMinutes);
      sEl?.removeEventListener('wheel', handleWheelSeconds);
    };
  }, []);

  const handleDragStart = (clientY: number, type: 'hours' | 'minutes' | 'seconds', currentVal: number) => {
    dragStartRef.current = { y: clientY, val: currentVal, type };
  };

  const handleDragMove = (clientY: number) => {
    if (!dragStartRef.current) return;
    const { y: startY, val, type } = dragStartRef.current;
    const diff = startY - clientY; // Drag up increases
    const steps = Math.round(diff / 20); // 20px per step sensitivity
    if (steps !== 0) {
      if (type === 'hours') {
        const newVal = (val + steps + 24 * 10) % 24;
        setHours(newVal);
      } else if (type === 'minutes') {
        const newVal = (val + steps + 60 * 10) % 60;
        setMinutes(newVal);
      } else if (type === 'seconds') {
        const newVal = (val + steps + 60 * 10) % 60;
        setSeconds(newVal);
      }
      dragStartRef.current.y = clientY - (diff % 20);
    }
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
  };

  // Load Saved Data
  useEffect(() => {
    // 1. Load Streak info
    const savedStreak = localStorage.getItem('habit_streak');
    const savedLastDate = localStorage.getItem('habit_last_completed_date');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedLastDate) setLastCompletedDate(savedLastDate);

    // 2. Save/Load user custom presets
    const savedPresets = localStorage.getItem('habit_presets_custom');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        setPresets(DEFAULT_PRESETS);
      }
    } else {
      setPresets(DEFAULT_PRESETS);
    }

    // 3. Ensure streak is updated/validated
    const today = new Date().toDateString();
    if (savedLastDate && savedLastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (savedLastDate !== yesterday.toDateString()) {
        setStreak(0);
        localStorage.setItem('habit_streak', '0');
      }
    }
  }, []);

  // Sync active YouTube progress specifically for each media source
  useEffect(() => {
    const savedIndexKey = `yt_progress_${mediaSource.id}_index`;
    const savedIndex = localStorage.getItem(savedIndexKey) || localStorage.getItem('yt_playlist_current_index');
    if (savedIndex) {
      setPlaylistIndex(parseInt(savedIndex, 10));
    } else {
      setPlaylistIndex(0);
    }
  }, [mediaSource.id]);

  // Sync active preset choices to wheel digits
  const selectPreset = (preset: CustomPreset) => {
    setSelectedPresetId(preset.id);
    setHours(preset.hours);
    setMinutes(preset.minutes);
    setSeconds(preset.seconds);
  };

  const parseYoutubeUrl = (url: string): { type: 'playlist' | 'video'; id: string } => {
    const trimmed = url.trim();
    if (!trimmed) {
      return { type: 'playlist', id: 'PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ' };
    }
    
    // Try playlist id
    const playlistMatch = trimmed.match(/[&?]list=([^&]+)/i) || trimmed.match(/playlist\/([^?]+)/i);
    if (playlistMatch && playlistMatch[1]) {
      return { type: 'playlist', id: playlistMatch[1] };
    }
    
    // Try video id
    const videoMatch = trimmed.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/|\/shorts\/)([^#&?]+)/i);
    if (videoMatch && videoMatch[1]) {
      return { type: 'video', id: videoMatch[1] };
    }

    if (trimmed.length > 15 && /^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return { type: 'playlist', id: trimmed };
    } else if (trimmed.length > 5 && /^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return { type: 'video', id: trimmed };
    }

    return { type: 'playlist', id: 'PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ' };
  };

  // Initialize YouTube Player
  useEffect(() => {
    let isMounted = true;

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const savedIndexKey = `yt_progress_${mediaSource.id}_index`;
    const savedTimeKey = `yt_progress_${mediaSource.id}_time`;

    const savedIndex = parseInt(
      localStorage.getItem(savedIndexKey) || 
      (mediaSource.id === 'PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ' ? localStorage.getItem('yt_playlist_current_index') : null) || 
      '0', 
      10
    );
    const savedTime = parseInt(
      localStorage.getItem(savedTimeKey) || 
      (mediaSource.id === 'PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ' ? localStorage.getItem('yt_playlist_current_time') : null) || 
      '0', 
      10
    );

    const initYT = () => {
      if (!isMounted) return;
      try {
        const container = document.getElementById('yt-habit-player-container');
        if (container) {
          container.innerHTML = '<div id="yt-habit-player-iframe" style="width: 100%; height: 100%;"></div>';
        }

        const playerVars: any = {
          autoplay: 0,
          controls: 1,
          rel: 0,
          showinfo: 1,
          modestbranding: 1,
          startSeconds: savedTime
        };

        if (mediaSource.type === 'playlist') {
          playerVars.listType = 'playlist';
          playerVars.list = mediaSource.id;
          playerVars.index = savedIndex;
        }

        const playerOptions: any = {
          height: '100%',
          width: '100%',
          playerVars: playerVars,
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsPlayerReady(true);
              event.target.setVolume(volume);
              updateTitle(event.target);
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const state = event.data;
              if (mediaSource.type === 'playlist') {
                const idx = event.target.getPlaylistIndex();
                if (idx !== -1 && idx !== undefined) {
                  setPlaylistIndex(idx);
                  localStorage.setItem(`yt_progress_${mediaSource.id}_index`, idx.toString());
                  localStorage.setItem('yt_playlist_current_index', idx.toString());
                }
              }
              if (state === 1) { // playing
                setIsPlaying(true);
                updateTitle(event.target);
              } else if (state === 2 || state === 0) { // paused or finished
                setIsPlaying(false);
              }
            }
          }
        };

        if (mediaSource.type === 'video') {
         playerOptions.videoId = mediaSource.id;
        }

        playerRef.current = new (window as any).YT.Player('yt-habit-player-iframe', playerOptions);
      } catch (err) {
        console.error("YouTube Player error", err);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initYT();
    } else {
      const previousBackup = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousBackup) previousBackup();
        initYT();
      };
    }

    // Capture playback time state to cache
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const t = playerRef.current.getCurrentTime();
          if (t > 0) {
            localStorage.setItem(`yt_progress_${mediaSource.id}_time`, Math.floor(t).toString());
            localStorage.setItem('yt_playlist_current_time', Math.floor(t).toString());
          }
        } catch (e) {}
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [mediaSource.id, mediaSource.type]);

  const updateTitle = (player: any) => {
    if (!player || typeof player.getVideoData !== 'function') return;
    try {
      const d = player.getVideoData();
      if (d && d.title) {
        setCurrentVideoTitle(d.title);
      }
    } catch (e) {
      setCurrentVideoTitle('Немецкий плейлист для привычек');
    }
  };

  // Synchronize countdown ticker
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Points and completed tracker
  useEffect(() => {
    if (timeLeft === 0 && isPlaying && !isCompleted) {
      finishRoutine();
    }
  }, [timeLeft, isPlaying, isCompleted]);

  // Handle Play toggle
  const togglePlay = () => {
    if (!isPlayerReady || !playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        if (isCompleted) {
          setTimeLeft(duration);
          setIsCompleted(false);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      setIsPlaying(!isPlaying);
    }
  };

  const pauseAll = () => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try { playerRef.current.pauseVideo(); } catch (e) {}
    }
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
      try {
        playerRef.current.nextVideo();
        setTimeout(() => updateTitle(playerRef.current), 600);
      } catch (e) {}
    }
  };

  const handlePrev = () => {
    if (playerRef.current && typeof playerRef.current.previousVideo === 'function') {
      try {
        playerRef.current.previousVideo();
        setTimeout(() => updateTitle(playerRef.current), 600);
      } catch (e) {}
    }
  };

  const resetAll = () => {
    pauseAll();
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  const updateVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setVolume(v);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(v);
    }
  };

  const finishRoutine = () => {
    pauseAll();
    setIsCompleted(true);

    // Calculate score
    const pointsToAdd = Math.min(Math.max(Math.floor(duration / 2), 100), 1000);
    
    // Streaks update
    const today = new Date().toDateString();
    let nextStreak = streak;
    if (lastCompletedDate !== today) {
      if (lastCompletedDate === new Date(Date.now() - 86400000).toDateString()) {
        nextStreak = streak + 1;
      } else {
        nextStreak = 1;
      }
      setStreak(nextStreak);
      setLastCompletedDate(today);
      localStorage.setItem('habit_streak', nextStreak.toString());
      localStorage.setItem('habit_last_completed_date', today);
    }

    onReward(pointsToAdd);
  };

  // Launch the Player
  const handleLaunch = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (totalSeconds <= 0) {
      alert("Выберите время больше 0!");
      return;
    }
    setDuration(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsCompleted(false);
    setViewState('player');
    
    // Auto-commence playing on launch
    setTimeout(() => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        try {
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch (e) {}
      }
    }, 800);
  };

  // Preset addition
  const addNewPreset = () => {
    if (!newPresetTitle.trim()) return;
    const item: CustomPreset = {
      id: 'custom_' + Date.now(),
      name: newPresetTitle,
      emoji: newPresetEmoji,
      titleRu: newPresetTitle,
      hours: 0,
      minutes: newPresetMin,
      seconds: 0
    };
    const updated = [...presets, item];
    setPresets(updated);
    localStorage.setItem('habit_presets_custom', JSON.stringify(updated));
    setSelectedPresetId(item.id);
    setHours(0);
    setMinutes(newPresetMin);
    setSeconds(0);
    setShowAddCustomModal(false);
    setNewPresetTitle('');
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't delete basic ones if desired, or allow all
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem('habit_presets_custom', JSON.stringify(updated));
    if (selectedPresetId === id && updated.length > 0) {
      selectPreset(updated[0]);
    }
  };

  const handleImportSource = () => {
    setImportError('');
    if (!customInputUrl.trim()) {
      setImportError('Пожалуйста, введите ссылку на YouTube.');
      return;
    }

    const { type, id } = parseYoutubeUrl(customInputUrl);
    if (!id) {
      setImportError('Не удалось распознать ID видео или плейлиста. Проверьте правильность введённой ссылки.');
      return;
    }

    const name = customInputName.trim() || (type === 'playlist' ? 'Свой плейлист' : 'Своё видео');
    const newSrc: MediaSource = {
      type,
      id,
      rawUrl: customInputUrl.trim(),
      name
    };

    setMediaSource(newSrc);
    localStorage.setItem('yt_custom_source', JSON.stringify(newSrc));
    
    // Load cached positions of this source if they exist
    const savedIdxKey = `yt_progress_${id}_index`;
    const savedIndex = parseInt(localStorage.getItem(savedIdxKey) || '0', 10);
    setPlaylistIndex(savedIndex);

    setShowSourceModal(false);
    setCustomInputUrl('');
    setCustomInputName('');
  };

  // Circular math for countdown
  const circleRadius = 45;
  const timerCircumference = 2 * Math.PI * circleRadius;
  const currentRatio = timeLeft / duration;
  const circleOffset = timerCircumference - (currentRatio * timerCircumference);

  const formatSecs = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper lists for the drum/spinner visuals
  const drumHours = [
    (hours + 23) % 24,
    hours,
    (hours + 1) % 24
  ];
  const drumMinutes = [
    (minutes + 59) % 60,
    minutes,
    (minutes + 1) % 60
  ];
  const drumSeconds = [
    (seconds + 59) % 60,
    seconds,
    (seconds + 1) % 60
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-100 to-brand-50/20 text-slate-800 font-sans overflow-x-hidden antialiased flex flex-col justify-between pb-10">
      
      {/* Primary Container Wrap */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-4 flex flex-col flex-grow">
        
        {/* Minimal header navbar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-200 mb-6 font-sans">
          <button 
            onClick={() => {
              if (viewState === 'player') {
                pauseAll();
                setViewState('setup');
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors bg-white hover:bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span>{viewState === 'player' ? 'Изменить таймер' : 'В меню'}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>STREAK: {streak}</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>{currentPoints} PTS</span>
            </div>
          </div>
        </div>

        {/* ----------------- PHASE 1: SETUP SCREEN ----------------- */}
        {viewState === 'setup' && (
          <div className="flex flex-col flex-grow justify-around items-center max-w-xl mx-auto w-full my-auto py-4">
            
            {/* Header Title replacing mock tab bar */}
            <div className="flex flex-col items-center gap-1.5 mb-6 select-none text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f43f5e] bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/10">
                Режим Таймера
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-800 mt-1.5 font-sans">Таймер ухода • Немецкий язык</h2>
              <p className="text-xs text-slate-500">Вращайте колесо мыши или перетаскивайте цифры вверх/вниз</p>
            </div>

            {/* Drum Spinner Visual Area */}
            <div className="flex items-center justify-center gap-6 select-none my-6 w-full relative">
              
              {/* Vertical center indicator borders */}
              <div className="absolute inset-x-0 h-16 border-y border-slate-200 pointer-events-none top-1/2 -translate-y-1/2 bg-slate-500/5 z-0"></div>

              {/* HOURS COLUMN */}
              <div 
                ref={hoursColRef}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientY, 'hours', hours)}
                onTouchMove={(e) => {
                  handleDragMove(e.touches[0].clientY);
                }}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => {
                  handleDragStart(e.clientY, 'hours', hours);
                  const onMouseMove = (moveEv: MouseEvent) => {
                    handleDragMove(moveEv.clientY);
                  };
                  const onMouseUp = () => {
                    handleDragEnd();
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                  };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                }}
                className="flex flex-col items-center justify-center w-24 h-48 relative overflow-hidden text-center z-10 cursor-ns-resize"
              >
                {/* Upper helper element */}
                <div 
                  onClick={() => setHours(prev => (prev + 23) % 24)}
                  className="text-slate-400 hover:text-slate-600 text-3xl font-light cursor-pointer transition-all py-1 select-none opacity-50 scale-90"
                >
                  {drumHours[0].toString().padStart(2, '0')}
                </div>
                {/* Active value */}
                <div className="text-6xl font-extrabold text-[#f43f5e] py-2 select-none flex items-baseline justify-center gap-1.5 scale-100 transition-all duration-150">
                  <span>{drumHours[1].toString().padStart(2, '0')}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">ч</span>
                </div>
                {/* Lower helper element */}
                <div 
                  onClick={() => setHours(prev => (prev + 1) % 24)}
                  className="text-slate-400 hover:text-slate-600 text-3xl font-light cursor-pointer transition-all py-1 select-none opacity-50 scale-90"
                >
                  {drumHours[2].toString().padStart(2, '0')}
                </div>
              </div>

              {/* MINUTES COLUMN */}
              <div 
                ref={minutesColRef}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientY, 'minutes', minutes)}
                onTouchMove={(e) => {
                  handleDragMove(e.touches[0].clientY);
                }}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => {
                  handleDragStart(e.clientY, 'minutes', minutes);
                  const onMouseMove = (moveEv: MouseEvent) => {
                    handleDragMove(moveEv.clientY);
                  };
                  const onMouseUp = () => {
                    handleDragEnd();
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                  };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                }}
                className="flex flex-col items-center justify-center w-28 h-48 relative overflow-hidden text-center z-10 cursor-ns-resize"
              >
                {/* Upper helper element */}
                <div 
                  onClick={() => setMinutes(prev => (prev + 59) % 60)}
                  className="text-slate-400 hover:text-slate-600 text-3xl font-light cursor-pointer transition-all py-1 select-none opacity-50 scale-90"
                >
                  {drumMinutes[0].toString().padStart(2, '0')}
                </div>
                {/* Active value */}
                <div className="text-6xl font-extrabold text-[#f43f5e] py-2 select-none flex items-baseline justify-center gap-1.5 scale-100 transition-all duration-150">
                  <span>{drumMinutes[1].toString().padStart(2, '0')}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">мин</span>
                </div>
                {/* Lower helper element */}
                <div 
                  onClick={() => setMinutes(prev => (prev + 1) % 60)}
                  className="text-slate-400 hover:text-slate-600 text-3xl font-light cursor-pointer transition-all py-1 select-none opacity-50 scale-90"
                >
                  {drumMinutes[2].toString().padStart(2, '0')}
                </div>
              </div>

              {/* SECONDS COLUMN */}
              <div 
                ref={secondsColRef}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientY, 'seconds', seconds)}
                onTouchMove={(e) => {
                  handleDragMove(e.touches[0].clientY);
                }}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => {
                  handleDragStart(e.clientY, 'seconds', seconds);
                  const onMouseMove = (moveEv: MouseEvent) => {
                    handleDragMove(moveEv.clientY);
                  };
                  const onMouseUp = () => {
                    handleDragEnd();
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                  };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                }}
                className="flex flex-col items-center justify-center w-24 h-48 relative overflow-hidden text-center z-10 cursor-ns-resize"
              >
                {/* Upper helper */}
                <div 
                  onClick={() => setSeconds(prev => (prev + 59) % 60)}
                  className="text-slate-400 hover:text-slate-600 text-3xl font-light cursor-pointer transition-all py-1 select-none opacity-50 scale-90"
                >
                  {drumSeconds[0].toString().padStart(2, '0')}
                </div>
                {/* Active value */}
                <div className="text-6xl font-extrabold text-[#f43f5e] py-2 select-none flex items-baseline justify-center gap-1.5 scale-100 transition-all duration-150">
                  <span>{drumSeconds[1].toString().padStart(2, '0')}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">с</span>
                </div>
                {/* Lower helper */}
                <div 
                  onClick={() => setSeconds(prev => (prev + 1) % 60)}
                  className="text-slate-400 hover:text-slate-600 text-3xl font-light cursor-pointer transition-all py-1 select-none opacity-50 scale-90"
                >
                  {drumSeconds[2].toString().padStart(2, '0')}
                </div>
              </div>

            </div>

            {/* Presets Row matching the circular buttons/presets */}
            <div className="w-full mt-6 mb-10">
              <div className="grid grid-cols-4 gap-4 justify-items-center">
                {presets.map((p) => {
                  const isActive = selectedPresetId === p.id;
                  return (
                    <div key={p.id} className="flex flex-col items-center">
                      <button
                        onClick={() => selectPreset(p)}
                        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all relative ${
                          isActive 
                            ? 'bg-rose-600 border-2 border-rose-400 shadow-lg text-white font-semibold' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-sm'
                        }`}
                      >
                        <span className="text-xl -mt-1">{p.emoji}</span>
                        <span className="text-[9px] font-mono mt-0.5 opacity-90">
                          {p.minutes.toString().padStart(2, '0')}:00
                        </span>

                        {p.id !== 'teeth' && p.id !== 'massage' && p.id !== 'eggs' && (
                          <button
                            onClick={(e) => deletePreset(p.id, e)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-red-600 border border-white"
                          >
                            ×
                          </button>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-500 text-center mt-2 line-clamp-1 w-20">
                        {p.titleRu}
                      </span>
                    </div>
                  );
                })}

                {/* Add Custom Button Circle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setShowAddCustomModal(true)}
                    className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-300 text-slate-400 flex items-center justify-center transition-all hover:bg-slate-50 hover:text-slate-600 hover:border-slate-400 shadow-sm"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                  <span className="text-[10px] text-slate-400 mt-2">Свой</span>
                </div>
              </div>
            </div>

            {/* Custom YouTube Source Section */}
            <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 mb-6 text-left shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    YouTube Источник 📺
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSourceModal(true)}
                  className="text-[11px] bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 active:scale-95 px-3 py-1.5 rounded-full border border-rose-500/20 font-semibold transition-all cursor-pointer"
                >
                  Выбрать видео/плейлист
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {mediaSource.name || 'По умолчанию: Описание картинок'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {mediaSource.type === 'playlist' ? 'Плейлист ID: ' : 'Видео ID: '}{mediaSource.id}
                  </p>
                </div>
                
                {mediaSource.id !== 'PL0Ma0Xw0pXK-eMCgKu7PcAlTENmgP73OZ' && (
                  <button
                    onClick={() => {
                      const defaultSrc = PRESET_SOURCES[0];
                      setMediaSource(defaultSrc);
                      localStorage.setItem('yt_custom_source', JSON.stringify(defaultSrc));
                      const savedIdx = parseInt(localStorage.getItem(`yt_progress_${defaultSrc.id}_index`) || '0', 10);
                      setPlaylistIndex(savedIdx);
                    }}
                    className="text-[10px] text-slate-500 hover:text-rose-600 underline cursor-pointer shrink-0 transition-colors"
                  >
                    Сбросить
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Modals */}
            <AnimatePresence>
              {/* Custom Preset Modal */}
              {showAddCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white border border-slate-200 p-6 rounded-3xl w-full max-w-sm text-left shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Добавить таймер ухода</h3>
                    
                    <div className="mb-4">
                      <label className="text-xs text-slate-500 block mb-1">Название процедуры:</label>
                      <input 
                        type="text" 
                        value={newPresetTitle}
                        onChange={(e) => setNewPresetTitle(e.target.value)}
                        placeholder="Зарядка, Йога..."
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-500" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Длительность (мин):</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="120"
                          value={newPresetMin}
                          onChange={(e) => setNewPresetMin(parseInt(e.target.value, 10) || 5)}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Иконка / Эмодзи:</label>
                        <select 
                          value={newPresetEmoji}
                          onChange={(e) => setNewPresetEmoji(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-500 appearance-none"
                        >
                          <option value="🪥">🪥 Зубная</option>
                          <option value="🧘">🧘 Йога</option>
                          <option value="🍳">🍳 Завтрак</option>
                          <option value="💪">💪 Мышцы</option>
                          <option value="☕">☕ Кофе</option>
                          <option value="🚿">🚿 Душ</option>
                          <option value="📅">📅 Планирование</option>
                          <option value="✨">✨ Магия</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       <button 
                        onClick={() => setShowAddCustomModal(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium p-3 rounded-xl text-xs transition-all border border-slate-200 shadow-sm"
                      >
                        Отмена
                      </button>
                      <button 
                        onClick={addNewPreset}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold p-3 rounded-xl text-xs transition-all shadow-md"
                      >
                        Сохранить
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* YouTube Media Source Selection Modal */}
              {showSourceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white border border-slate-200 p-6 rounded-3xl w-full max-w-md text-left shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-rose-500" />
                        <span>Выбрать источник YouTube</span>
                      </h3>
                      <button 
                        onClick={() => setShowSourceModal(false)}
                        className="text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer p-1"
                      >
                        ×
                      </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Выберите один из рекомендованных немецких плейлистов или вставьте ссылку на своё видео / плейлист.
                    </p>

                    {/* Pre-configured Presets */}
                    <div className="space-y-2 mb-5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Рекомендованные плейлисты:
                      </label>
                      {PRESET_SOURCES.map((src) => {
                        const isSelected = mediaSource.id === src.id;
                        return (
                          <button
                            key={src.id}
                            type="button"
                            onClick={() => {
                              setMediaSource(src);
                              localStorage.setItem('yt_custom_source', JSON.stringify(src));
                              const savedIdx = parseInt(localStorage.getItem(`yt_progress_${src.id}_index`) || '0', 10);
                              setPlaylistIndex(savedIdx);
                              setShowSourceModal(false);
                            }}
                            className={`w-full text-left p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-rose-50/70 border-rose-500/40 text-rose-700 font-semibold shadow-sm' 
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="truncate pr-4">{src.name}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-rose-600 px-2 py-0.5 rounded-full text-white font-bold shrink-0 animate-pulse">
                                Активен
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Link Input Area */}
                    <div className="border-t border-slate-200 pt-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                        Свой плейлист или видео (YouTube):
                      </label>
                      <div className="space-y-3">
                        <div>
                          <input 
                            type="text" 
                            value={customInputUrl}
                            onChange={(e) => setCustomInputUrl(e.target.value)}
                            placeholder="Вставьте ссылку на YouTube (например, https://youtu.be/...)"
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-rose-500" 
                          />
                        </div>
                        <div>
                          <input 
                            type="text" 
                            value={customInputName}
                            onChange={(e) => setCustomInputName(e.target.value)}
                            placeholder="Название (например: Немецкое Радио)"
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-rose-500" 
                          />
                        </div>

                        {importError && (
                          <p className="text-[11px] text-rose-500 font-medium">
                            {importError}
                          </p>
                        )}

                        <button 
                          type="button"
                          onClick={handleImportSource}
                          className="w-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                          <Link className="w-3.5 h-3.5" />
                          Подключить этот источник
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Giant "Пуск" Button matching the screenshot styling */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLaunch}
              className="w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white py-4 px-8 rounded-full font-bold text-lg tracking-wide shadow-xl active:bg-[#be123c] transition-all flex items-center justify-center gap-2 mt-4"
            >
              Пуск
            </motion.button>
          </div>
        )}

        {/* ----------------- PHASE 2: PLAY VIEWSCREEN ----------------- */}
        {/* Render persistent layout wrapper to guarantee Youtube Iframe does not unmount in DOM */}
        <div 
          className={`flex-col flex-grow items-center justify-between py-2 gap-4 w-full transition-all duration-300 ${
            viewState === 'player' 
              ? 'flex' 
              : 'absolute opacity-0 pointer-events-none scale-95 overflow-hidden w-0 h-0 select-none z-[-10] left-[-9999px]'
          }`}
        >
            
            {/* Top Row: Mini visual widget for track name and streak alerts */}
            <div className="w-full bg-white border border-slate-200 p-4 rounded-3xl flex items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500/10 rounded-full border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Аудирование (Трек #{playlistIndex + 1})
                  </span>
                  <h4 className="text-xs text-slate-800 font-bold line-clamp-1">
                    {currentVideoTitle}
                  </h4>
                </div>
              </div>

              {/* Minimalist Return Setup Link */}
              <button 
                onClick={() => {
                  pauseAll();
                  setViewState('setup');
                }}
                className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 font-medium shadow-sm transition-colors cursor-pointer"
              >
                Изменить время
              </button>
            </div>

            {/* MAIN YOUTUBE FOCUS (Takes primary screenspace) */}
            <div className="w-full flex-grow flex flex-col items-center justify-center my-1 relative min-h-[300px] lg:min-h-[440px] rounded-4xl border border-slate-200 bg-white overflow-hidden shadow-xl">
              
              {/* Background cover until player ready */}
              {!isPlayerReady && (
                <div className="absolute inset-0 z-20 bg-slate-50 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 border-t-2 border-rose-500 rounded-full animate-spin"></div>
                  <span className="text-slate-500 text-xs">Подготовка плейлиста YouTube...</span>
                </div>
              )}

              {/* Full sized iframe player focus inside persistent container */}
              <div id="yt-habit-player-container" className="w-full h-full aspect-video z-10">
                <div id="yt-habit-player-iframe" className="w-full h-full" />
              </div>

              {/* IN-PLAYER ERGONOMIC TIMER OVERLAY */}
              {/* This places the timer in an elegant floating overlay at top-right or bottom-right corner, 
                  blending beautifully without obstructing standard controls */}
              <div className="absolute top-4 right-4 z-30 pointer-events-none select-none flex items-center gap-3">
                
                {/* Visual Glow Layer */}
                <div className="absolute inset-0 bg-rose-500/5 blur-xl rounded-full -z-10"></div>

                <div className="bg-white/95 border border-slate-200 p-2.5 rounded-3xl flex items-center gap-3 pointer-events-auto shadow-xl backdrop-blur-md">
                  
                  {/* Small Circular countdown "melting" */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="20" 
                        className="stroke-slate-100" 
                        strokeWidth="3.5"
                        fill="none" 
                      />
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="20" 
                        className="stroke-rose-500" 
                        strokeWidth="3.5"
                        fill="none" 
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 - (currentRatio * 2 * Math.PI * 20)}
                        strokeLinecap="round"
                        style={{ transition: isPlaying ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.4s ease' }}
                      />
                    </svg>
                    <div className="absolute text-[9px] font-mono font-bold text-slate-800">
                      {Math.ceil(timeLeft / 60)}м
                    </div>
                  </div>

                  {/* Timing detail text */}
                  <div className="pr-1.5">
                    <span className="text-[14px] font-mono font-bold text-rose-500 block leading-none">
                      {formatSecs(timeLeft)}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium block mt-0.5">
                      {isPlaying ? 'осталось' : 'на паузе'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* CONTROLLER DECK & PLAYER CONTROLS (Ergonomic cluster at base) */}
            <div className="w-full bg-white border border-slate-200 p-5 rounded-4xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Reset, Previous, Play list controls */}
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={handlePrev}
                  disabled={!isPlayerReady}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors disabled:opacity-50 border border-slate-100 shadow-sm cursor-pointer"
                  title="Предыдущий трек"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button 
                  onClick={togglePlay}
                  disabled={!isPlayerReady}
                  className="p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-all shadow-md transform hover:scale-105 cursor-pointer"
                  title={isPlaying ? 'Пауза' : 'Слушать'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button 
                  onClick={handleNext}
                  disabled={!isPlayerReady}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors disabled:opacity-50 border border-slate-100 shadow-sm cursor-pointer"
                  title="Следующий трек"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button 
                  onClick={resetAll}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors border border-slate-100 shadow-sm cursor-pointer"
                  title="Сбросить таймер"
                >
                  <RotateCcw className="w-4 h-4 animate-hover" />
                </button>
              </div>

              {/* Progress Detail description indicator */}
              <div className="text-center md:text-left flex-grow max-w-sm px-2">
                <p className="text-xs text-slate-500 leading-snug">
                  {isCompleted 
                    ? 'Поздравляем! Очки зачислены. Вы можете сбросить таймер и повторить сессию!' 
                    : ''}
                </p>
              </div>

              {/* Sound Adjustment deck */}
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 w-full md:w-56">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={updateVolume}
                  className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-600 font-bold w-6 text-right select-none">{volume}%</span>
              </div>

            </div>

            {/* Completed modal congratulatory pop */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="w-full bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-3xl flex items-center justify-between gap-4 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl block shadow-lg shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-700 text-sm">Отличный тайм-менеджмент немецкого!</h4>
                      <p className="text-xs text-slate-500">
                        Вы успешно совместили уход за собой с изучением немецкого.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 text-sm font-bold block">+ {Math.min(Math.max(Math.floor(duration / 2), 100), 1000)} PTS</span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">Streak up!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

      </div>
    </div>
  );
}
