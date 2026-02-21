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
  preload: () => void;
}

export interface PianoState {
  activeKeys: Set<number>;
  isPlaying: boolean;
}
