export interface PianoKey {
  id: number;
  note: string;
  type: 'white' | 'black';
  row: number;
  position: number;
  audioPath: string;
  keyboardKey?: string;
}

export interface PianoKeyProps {
  pianoKey: PianoKey;
  isActive: boolean;
  onPressed: (keyId: number) => void;
  onReleased: (keyId: number) => void;
  showKeyboardMappings: boolean;
  style?: React.CSSProperties;
}

export interface PianoRow {
  rowNumber: number;
  keys: PianoKey[];
}

export interface PianoRowProps {
  row: PianoRow;
  activeKeys: Set<number>;
  onPressed: (keyId: number) => void;
  onReleased: (keyId: number) => void;
  showKeyboardMappings: boolean;
}


export interface AudioPlayer {
  play: (keyId: number) => void;
  stop: (keyId: number) => void;
  preload: () => Promise<void>;
}

export interface PianoState {
  activeKeys: Set<number>;
  isPlaying: boolean;
}

export interface KeyboardMapping {
  white: string[];
  black: string[];
}

export interface KeyboardMappings {
  row1: KeyboardMapping;
  row2: KeyboardMapping;
  row3: KeyboardMapping;
  row4: KeyboardMapping;
}

export type KeyType = 'white' | 'black';
export type RowNumber = 0 | 1 | 2 | 3;
