export interface PianoKey {
  id: number;
  note: string;
  type: 'white' | 'black';
  row: number;
  position: number;
  audioPath: string;
  keyboardKey?: string;
}

export interface PianoRow {
  rowNumber: number;
  keys: PianoKey[];
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
