import { WordSet } from '../types';
import { lektion1 } from './lessons/lektion1';
import { lektion2_technik } from './lessons/lektion2_technik';
import { lektion2_bonus } from './lessons/lektion2_bonus';
import { lektion2_verben } from './lessons/lektion2_verben';

export const INITIAL_SETS: WordSet[] = [
  lektion1,
  lektion2_technik,
  lektion2_bonus,
  lektion2_verben
];
