import type { CategoryId } from '../types';

interface MessageSet {
  fresh: string[];
  due: string[];
  overdue: string[];
  neverDone: string[];
}

const defaultMessages: MessageSet = {
  fresh: [
    "You're on top of it!",
    'Look at you being responsible!',
    'Gold star for adulting.',
    'Future you says thanks.',
  ],
  due: [
    'Starting to slip...',
    'Maybe put this on the list?',
    "It's been a minute.",
    'Might want to get on that.',
  ],
  overdue: [
    "It's been... a while.",
    'This is getting awkward.',
    "We need to talk about this.",
    "Let's not make this a habit.",
  ],
  neverDone: [
    "You've literally never done this.",
    'First time for everything, right?',
    'Any day now...',
    'This has been on your list since... forever.',
  ],
};

const categoryMessages: Partial<Record<CategoryId, Partial<MessageSet>>> = {
  home: {
    overdue: [
      'Your house is judging you.',
      'The neighbors can tell.',
      'Bob Vila would be disappointed.',
      'Your home warranty just flinched.',
    ],
  },
  car: {
    overdue: [
      'Your car is making that sound again.',
      'Check engine light is on in spirit.',
      'Your mechanic misses you.',
      "AAA has you on speed dial.",
    ],
  },
  health: {
    overdue: [
      'Your dentist filed a missing persons report.',
      'Your doctor is worried.',
      'WebMD is not a substitute.',
      'Your health insurance is wasted right now.',
    ],
  },
  personal: {
    overdue: [
      'Your mom is wondering if you changed your number.',
      'Relationships require maintenance too.',
      "Someone out there misses you.",
      'Your social life called — it wants attention.',
    ],
  },
  pet: {
    overdue: [
      'Your pet is giving you side-eye.',
      'They depend on you, you know.',
      'Even pets hold grudges.',
      'The vet sent a postcard.',
    ],
  },
};

function pickRandom(arr: string[]): string {
  // Use a deterministic-ish pick based on current hour so it doesn't flicker
  const hourSeed = new Date().getHours();
  return arr[hourSeed % arr.length];
}

export function getPersonalityMessage(
  categoryId: CategoryId,
  urgencyLevel: 'fresh' | 'due' | 'overdue',
  _percentElapsed: number,
  neverDone: boolean
): string {
  if (neverDone) {
    const msgs = categoryMessages[categoryId]?.neverDone ?? defaultMessages.neverDone;
    return pickRandom(msgs);
  }

  const categoryMsgs = categoryMessages[categoryId]?.[urgencyLevel];
  const msgs = categoryMsgs ?? defaultMessages[urgencyLevel];
  return pickRandom(msgs);
}
