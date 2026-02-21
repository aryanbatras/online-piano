import { PianoKey, PianoRow, KeyboardMappings, KeyType } from '@/types/piano';

const notes = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const whiteKeyPattern = [0, 2, 4, 5, 7, 9, 11];
const blackKeyPattern = [1, 3, 6, 8, 10];

const keyboardMapping: KeyboardMappings = {
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

const getRowMapping = (row: number) => {
  switch (row) {
    case 0: return keyboardMapping.row1;
    case 1: return keyboardMapping.row2;
    case 2: return keyboardMapping.row3;
    default: return keyboardMapping.row4;
  }
};

const getKeyPositionInRow = (globalIndex: number) => {
  const row = Math.floor(globalIndex / 22);
  return globalIndex % 22;
};

const countKeysBeforePosition = (row: number, positionInRow: number, keyType: KeyType) => {
  let count = 0;
  
  for (let j = 0; j < positionInRow; j++) {
    const globalIndex = row * 22 + j;
    const noteIndex = globalIndex % 12;
    const isBlack = blackKeyPattern.includes(noteIndex);
    
    if ((keyType === 'black' && isBlack) || (keyType === 'white' && !isBlack)) {
      count++;
    }
  }
  
  return count;
};

const generatePianoKey = (index: number): PianoKey => {
  const octave = Math.floor(index / 12);
  const noteIndex = index % 12;
  const note = notes[noteIndex];
  const isBlack = blackKeyPattern.includes(noteIndex);
  
  const row = Math.floor(index / 22);
  const positionInRow = index % 22;
  const rowMapping = getRowMapping(row);
  
  let keyboardKey: string | undefined;
  
  if (isBlack) {
    const blackKeyCount = countKeysBeforePosition(row, positionInRow, 'black');
    if (blackKeyCount < rowMapping.black.length) {
      keyboardKey = rowMapping.black[blackKeyCount];
    }
  } else {
    const whiteKeyCount = countKeysBeforePosition(row, positionInRow, 'white');
    if (whiteKeyCount < rowMapping.white.length) {
      keyboardKey = rowMapping.white[whiteKeyCount];
    }
  }
  
  return {
    id: index + 1,
    note: `${note}${octave}`,
    type: isBlack ? 'black' as KeyType : 'white' as KeyType,
    row,
    position: positionInRow,
    audioPath: `/piano_keys/${index + 1}.mp3`,
    keyboardKey
  };
};

export const generatePianoKeys = (): PianoKey[] => {
  return Array.from({ length: 88 }, (_, i) => generatePianoKey(i));
};

export const generatePianoRows = (keys: PianoKey[]): PianoRow[] => {
  const rows: PianoRow[] = [];
  
  for (let row = 0; row < 4; row++) {
    const rowKeys = keys.filter(key => key.row === row);
    rows.push({
      rowNumber: row,
      keys: rowKeys
    });
  }
  
  return rows;
};

export const findPianoKeyByKeyCode = (keyCode: string, shiftPressed: boolean, keys: PianoKey[]): PianoKey | null => {
  return keys.find(key => {
    if (!key.keyboardKey) return false;
    
    if (shiftPressed) {
      return key.keyboardKey === keyCode && key.keyboardKey === keyCode.toUpperCase();
    } else {
      return key.keyboardKey === keyCode && key.keyboardKey === keyCode.toLowerCase();
    }
  }) || null;
};

export const pianoKeys = generatePianoKeys();
export const pianoRows = generatePianoRows(pianoKeys);
