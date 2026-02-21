import { State, StereoAudioRecorder } from 'recordrtc';

export interface AudioRecorderState {
  recordingStatus: State | undefined;
  recordingTime: number;
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AudioRecorderActions {
  startRecording: () => Promise<void>;
  stopRecording: (callback?: (blob?: Blob, blobURL?: string) => void) => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  saveRecording: (fileName?: string) => void;
  getBlob: () => Blob | undefined;
  toggleRecord: () => void;
}

export interface AudioPlayerState {
  isPreloaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AudioPlayerActions {
  play: (keyId: number) => void;
  stop: (keyId: number) => void;
  preload: () => Promise<void>;
}

export interface RecordingConfig {
  type: 'audio';
  recorderType: typeof StereoAudioRecorder;
  desiredSampRate: number;
  disableLogs: boolean;
}

export interface AudioStreamConfig {
  video: boolean;
  audio: boolean;
}
