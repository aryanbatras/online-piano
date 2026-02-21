import { PianoKey, PianoRow } from '@/types/piano';

const notes = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const whiteKeyPattern = [0, 2, 4, 5, 7, 9, 11];
const blackKeyPattern = [1, 3, 6, 8, 10];

const keyboardMapping = {
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

export const generatePianoKeys = (): PianoKey[] => {
  const keys: PianoKey[] = [];
  
  for (let i = 0; i < 88; i++) {
    const octave = Math.floor(i / 12);
    const noteIndex = i % 12;
    const note = notes[noteIndex];
    const isBlack = blackKeyPattern.includes(noteIndex);
    
    const row = Math.floor(i / 22);
    const positionInRow = i % 22;
    
    let keyboardKey: string | undefined;
    const rowMapping = row === 0 ? keyboardMapping.row1 : 
                      row === 1 ? keyboardMapping.row2 : 
                      row === 2 ? keyboardMapping.row3 : 
                      keyboardMapping.row4;
    
    const whiteKeysInRow = rowMapping.white;
    const blackKeysInRow = rowMapping.black;
    
    let whiteKeyCount = 0;
    let blackKeyCount = 0;
    
    for (let j = 0; j < positionInRow; j++) {
      const jOctave = Math.floor((row * 22 + j) / 12);
      const jNoteIndex = (row * 22 + j) % 12;
      if (blackKeyPattern.includes(jNoteIndex)) {
        blackKeyCount++;
      } else {
        whiteKeyCount++;
      }
    }
    
    if (isBlack) {
      if (blackKeyCount < blackKeysInRow.length) {
        keyboardKey = blackKeysInRow[blackKeyCount];
      }
    } else {
      if (whiteKeyCount < whiteKeysInRow.length) {
        keyboardKey = whiteKeysInRow[whiteKeyCount];
      }
    }
    
    keys.push({
      id: i + 1,
      note: `${note}${octave}`,
      type: isBlack ? 'black' : 'white',
      row,
      position: positionInRow,
      audioPath: `/piano_keys/${i + 1}.mp3`,
      keyboardKey
    });
  }
  
  return keys;
};

export const generatePianoRows = (): PianoRow[] => {
  const allKeys = generatePianoKeys();
  const rows: PianoRow[] = [];
  
  for (let row = 0; row < 4; row++) {
    const rowKeys = allKeys.filter(key => key.row === row);
    rows.push({
      rowNumber: row,
      keys: rowKeys
    });
  }
  
  return rows;
};

export const findPianoKeyByKeyCode = (keyCode: string, shiftPressed: boolean): PianoKey | null => {
  const allKeys = generatePianoKeys();
  
  return allKeys.find(key => {
    if (!key.keyboardKey) return false;
    
    if (shiftPressed) {
      return key.keyboardKey === keyCode && key.keyboardKey === keyCode.toUpperCase();
    } else {
      return key.keyboardKey === keyCode && key.keyboardKey === keyCode.toLowerCase();
    }
  }) || null;
};

export const pianoKeys = generatePianoKeys();
export const pianoRows = generatePianoRows();
