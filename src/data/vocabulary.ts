import { WordSet } from '../types';
import { lektion1 } from './lessons/lektion1';
import { lektion2_technik } from './lessons/lektion2_technik';
import { lektion2_bonus } from './lessons/lektion2_bonus';
import { lektion2_verben } from './lessons/lektion2_verben';
import { lektion3 } from './lessons/lektion3';
import { starkeVerben } from './lessons/starke_verben';
import { modalVerben } from './lessons/modal_verben';
import { reflexiveVerben } from './lessons/reflexive_verben';
import { verbenMitPraepositionen } from './lessons/verben_mit_praepositionen';
import { inDerStadt } from './lessons/in_der_stadt';
import { umwelt } from './lessons/umwelt';

export const INITIAL_SETS: WordSet[] = [
  lektion1,
  lektion2_technik,
  lektion2_bonus,
  lektion2_verben,
  lektion3,
  starkeVerben,
  modalVerben,
  reflexiveVerben,
  verbenMitPraepositionen,
  inDerStadt,
  umwelt
];
