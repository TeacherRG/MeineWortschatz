import { WordSet } from '../types';

export const INITIAL_SETS: WordSet[] = [
  {
    id: 'unit-1-urlaub',
    title: 'Lektion 1: Urlaub & Reisen',
    description: 'Urlaubsformen, Planung, Natur und Aktivitäten',
    words: [
      // Urlaubsformen
      { id: '1', german: 'der Winterurlaub, -e', translation: 'зимний отпуск', category: 'Urlaubsformen' },
      { id: '2', german: 'das Skigebiet, -e', translation: 'горнолыжный курорт', category: 'Urlaubsformen' },
      { id: '3', german: 'der (Ski-)Lift, -e', translation: 'подъемник', category: 'Urlaubsformen' },
      { id: '4', german: 'der Strandurlaub, -e', translation: 'пляжный отдых', category: 'Urlaubsformen' },
      { id: '5', german: 'die Küste, -n', translation: 'побережье', category: 'Urlaubsformen' },
      { id: '6', german: 'der Sand', translation: 'песок', category: 'Urlaubsformen' },
      { id: '7', german: 'die Strandpromenade, -n', translation: 'набережная', category: 'Urlaubsformen' },
      { id: '7b', german: 'der Urlaubsgruß, -¨e', translation: 'привет из отпуска', category: 'Urlaubsformen' },
      { id: '7c', german: 'der Empfang (Sg.)', translation: 'прием (сигнала)', category: 'Urlaubsformen', example: 'Das Handy hat keinen Empfang.' },
      { id: '7d', german: 'weg sein', translation: 'отсутствовать / быть далеко', category: 'Urlaubsformen', example: 'Die Stadt ist weit weg.' },
      
      // Urlaubsplanung
      { id: '8', german: 'der Zeitpunkt, -e', translation: 'момент / дата / срок', category: 'Urlaubsplanung' },
      { id: '9', german: 'der Terminkalender, -', translation: 'ежедневник', category: 'Urlaubsplanung' },
      { id: '10', german: 'rechtzeitig', translation: 'вовремя / в срок', category: 'Urlaubsplanung' },
      { id: '11', german: 'gründlich', translation: 'основательно', category: 'Urlaubsplanung' },
      { id: '12', german: 'buchen', translation: 'заказывать / бронировать', category: 'Urlaubsplanung' },
      { id: '13', german: 'sich entschließen', translation: 'решаться', category: 'Urlaubsplanung' },
      { id: '14', german: 'die Halbpension', translation: 'полупансион', category: 'Urlaubsplanung' },
      { id: '14b', german: 'die Vollpension', translation: 'полный пансион', category: 'Urlaubsplanung' },
      { id: '14c', german: 'höchstens', translation: 'максимум / самое большее', category: 'Urlaubsplanung' },
      { id: '14d', german: 'enthalten sein', translation: 'быть включенным', category: 'Urlaubsplanung', example: 'Das Frühstück ist im Preis enthalten.' },
      { id: '14e', german: 'der Kompromiss, -e', translation: 'компромисс', category: 'Urlaubsplanung' },
      { id: '14f', german: 'meinetwegen', translation: 'ради меня / я не возражаю', category: 'Urlaubsplanung' },
      { id: '14g', german: 'dabei sein', translation: 'участвовать / присутствовать', category: 'Urlaubsplanung', example: 'Dann ist für jeden etwas dabei.' },
      { id: '14h', german: 'der Einfall, -¨e', translation: 'идея / выдумка', category: 'Urlaubsplanung', example: 'Das ist ein guter Einfall.' },
      { id: '14i', german: 'einpacken', translation: 'упаковывать', category: 'Urlaubsplanung' },
      { id: '14j', german: 'auspacken', translation: 'распаковывать', category: 'Urlaubsplanung' },
      { id: '14k', german: 'der Mitarbeiter, -', translation: 'сотрудник', category: 'Urlaubsplanung' },
      { id: '14l', german: 'die Unterkunft, -¨e', translation: 'жилье / размещение', category: 'Urlaubsplanung', example: 'Ich habe keine Lust, lange nach einer Unterkunft zu suchen.' },
      
      // Reisen
      { id: '15', german: 'das Urlaubsziel, -e', translation: 'цель поездки', category: 'Reisen' },
      { id: '16', german: 'die Entfernung, -en', translation: 'расстояние', category: 'Reisen' },
      { id: '17', german: 'die Fahrtzeit, -en', translation: 'время в пути', category: 'Reisen' },
      { id: '17b', german: 'gegen acht Uhr', translation: 'около восьми часов', category: 'Reisen' },
      { id: '17c', german: 'der Hauptbahnhof, -¨e', translation: 'главный вокзал', category: 'Reisen' },
      { id: '18', german: 'der Kofferraum, -¨e', translation: 'багажник', category: 'Reisen' },
      { id: '19', german: 'die Schifffahrt, -en', translation: 'судоходство / прогулка на корабле', category: 'Reisen' },
      { id: '19b', german: 'das Boot, -e', translation: 'лодка', category: 'Reisen' },
      
      // Natur
      { id: '20', german: 'die Alm, -en', translation: 'альпийский луг', category: 'Natur' },
      { id: '21', german: 'das Gebirge, -', translation: 'горный хребет', category: 'Natur' },
      { id: '22', german: 'die Wiese, -n', translation: 'луг', category: 'Natur' },
      { id: '23', german: 'die Traube, -n', translation: 'гроздь (винограда)', category: 'Natur' },
      { id: '24', german: 'reif', translation: 'зрелый', category: 'Natur' },
      { id: '25', german: 'die Einsamkeit', translation: 'одиночество / уединение', category: 'Natur' },
      { id: '25b', german: 'einsam', translation: 'одинокий', category: 'Natur', example: 'Auf der Alm ist es eher einsam.' },
      { id: '25c', german: 'das Insekt, -en', translation: 'насекомое', category: 'Natur' },
      { id: '25d', german: 'giftig', translation: 'ядовитый', category: 'Natur' },
      
      // Aktivitäten & Stimmung
      { id: '26', german: 'das Abenteuer, -', translation: 'приключение', category: 'Aktivitäten', example: 'ein Abenteuer erleben' },
      { id: '27', german: 'entspannend', translation: 'расслабляющий', category: 'Aktivitäten' },
      { id: '28', german: 'sich erholen', translation: 'отдыхать / восстанавливаться', category: 'Aktivitäten' },
      { id: '29', german: 'faulenzen', translation: 'бездельничать', category: 'Aktivitäten' },
      { id: '29b', german: 'spazieren', translation: 'гулять', category: 'Aktivitäten' },
      { id: '29c', german: 'der Pilz, -e', translation: 'гриб', category: 'Aktivitäten', example: 'Pilze sammeln' },
      { id: '30', german: 'begeistert sein', translation: 'быть в восторге', category: 'Stimmung' },
      { id: '31', german: 'zufrieden sein', translation: 'быть довольным', category: 'Stimmung' },
      { id: '32', german: 'enttäuscht sein', translation: 'быть разочарованным', category: 'Stimmung' },
      { id: '33', german: 'genervt sein', translation: 'быть раздраженным', category: 'Stimmung' },
      { id: '34', german: 'verzweifelt sein', translation: 'быть в отчаянии', category: 'Stimmung' },

      // Grammatik & Struktur
      { id: '35', german: 'eher', translation: 'скорее', category: 'Struktur', example: 'Auf der Alm ist es eher einsam.' },
      { id: '36', german: 'falls', translation: 'в случае если', category: 'Struktur', example: 'Falls ihr Lust habt, meldet euch.' },
      { id: '37', german: 'offenbar', translation: 'очевидно', category: 'Struktur', example: 'Offenbar hatten auch andere diese Idee.' },
      { id: '38', german: 'solche', translation: 'такие', category: 'Struktur', example: 'Wir kennen solche Listen.' },
      { id: '39', german: 'vorne liegen', translation: 'быть впереди', category: 'Struktur', example: 'Berlin liegt in dieser Liste ganz vorne.' },
      { id: '40', german: 'wieso', translation: 'почему', category: 'Struktur', example: 'Wieso fahren wir nicht an die Ostsee?' },
      { id: '41', german: 'da', translation: 'так как', category: 'Struktur', example: 'Da die Stadt sehr bekannt ist, gibt es viele Touristen.' },
      { id: '42', german: 'obwohl', translation: 'хотя', category: 'Struktur', example: 'Obwohl es geregnet hat, waren wir gut gelaunt.' },
      { id: '43', german: 'beinahe', translation: 'почти', category: 'Struktur', example: 'Ich war beinahe drei Monate auf der Alm.' },
    ]
  }
];
