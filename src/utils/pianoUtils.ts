import { PianoKey, PianoRow, KeyType } from '@/types/piano';
import { notes, blackKeyPattern } from '@/data/pianoData';

export const getKeyPositionInRow = (globalIndex: number) => {
  const row = Math.floor(globalIndex / 22);
  return globalIndex % 22;
};

export const countKeysBeforePosition = (row: number, positionInRow: number, keyType: KeyType) => {
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

export const generatePianoKey = (index: number, getRowMapping: (row: number) => any): PianoKey => {
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

export const generatePianoKeys = (getRowMapping: (row: number) => any): PianoKey[] => {
  return Array.from({ length: 88 }, (_, i) => generatePianoKey(i, getRowMapping));
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
