import { PianoKey, PianoRow, KeyboardMappings, KeyType } from '@/types/piano';
import { generatePianoKeys, generatePianoRows } from '@/utils/pianoUtils';

export const notes = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const blackKeyPattern = [1, 3, 6, 8, 10];

export const keyboardMapping: KeyboardMappings = {
  row1: {
    white: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    black: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_']
  },
  row2: {
    white: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    black: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}']
  },
  row3: {
    white: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    black: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"']
  },
  row4: {
    white: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '='],
    black: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '+']
  }
};

export const getRowMapping = (row: number) => {
  switch (row) {
    case 0: return keyboardMapping.row1;
    case 1: return keyboardMapping.row2;
    case 2: return keyboardMapping.row3;
    default: return keyboardMapping.row4;
  }
};

export const pianoKeys = generatePianoKeys(getRowMapping);
export const pianoRows = generatePianoRows(pianoKeys);
