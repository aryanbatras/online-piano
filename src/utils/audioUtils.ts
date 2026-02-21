import { AudioStreamConfig, RecordingConfig } from '@/types/audio';
import { StereoAudioRecorder } from 'recordrtc';

export const DEFAULT_RECORDING_CONFIG: RecordingConfig = {
  type: 'audio',
  recorderType: StereoAudioRecorder,
  desiredSampRate: 16000,
  disableLogs: true,
};

export const DEFAULT_STREAM_CONFIG: AudioStreamConfig = {
  video: true,
  audio: true,
};

export const getSystemAudioStream = async (config: AudioStreamConfig = DEFAULT_STREAM_CONFIG): Promise<MediaStream> => {
  return await navigator.mediaDevices.getDisplayMedia(config);
};

export const stopMediaStream = (stream: MediaStream): void => {
  stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
};

export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const generateRecordingFileName = (prefix: string = 'recording', extension: string = 'wav'): string => {
  return `${prefix}-${Date.now()}.${extension}`;
};

export const formatRecordingTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
