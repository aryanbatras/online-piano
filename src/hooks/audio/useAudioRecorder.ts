import { useEffect, useRef, useState, useCallback } from 'react';
import RecordRTC from 'recordrtc';
import { 
  AudioRecorderState, 
  AudioRecorderActions, 
  RecordingConfig 
} from '@/types/audio';
import { 
  getSystemAudioStream, 
  stopMediaStream, 
  downloadBlob, 
  generateRecordingFileName,
  DEFAULT_RECORDING_CONFIG 
} from '@/utils/audioUtils';

export const useAudioRecorder = (): AudioRecorderState & AudioRecorderActions => {
  const [state, setState] = useState<AudioRecorderState>({
    recordingStatus: undefined,
    recordingTime: 0,
    isRecording: false,
    isLoading: false,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const updateState = useCallback((updates: Partial<AudioRecorderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setState(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
    }, 1000);
  }, [clearTimer]);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });

      const stream = await getSystemAudioStream();
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, DEFAULT_RECORDING_CONFIG);
      recorderRef.current = recorder;

      await recorder.startRecording();

      updateState({
        recordingStatus: 'recording',
        isRecording: true,
        isLoading: false,
      });

      startTimer();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unable to access system audio. Make sure to check "Share audio" when selecting a tab or screen.';
      
      updateState({
        error: errorMessage,
        isLoading: false,
      });
      
      console.error('Recording start error:', error);
    }
  }, [updateState, startTimer]);

  const stopRecording = useCallback((callback?: (blob?: Blob, blobURL?: string) => void): void => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      try {
        clearTimer();

        if (streamRef.current) {
          stopMediaStream(streamRef.current);
          streamRef.current = null;
        }

        const blob = recorderRef.current?.getBlob();
        const blobURL = recorderRef.current?.toURL();
        
        updateState({
          recordingStatus: 'stopped',
          isRecording: false,
          recordingTime: 0,
        });

        callback?.(blob, blobURL);
      } catch (error) {
        console.error('Recording stop error:', error);
        updateState({ error: 'Failed to stop recording properly' });
      }
    });
  }, [updateState, clearTimer]);

  const pauseRecording = useCallback((): void => {
    if (recorderRef.current) {
      recorderRef.current.pauseRecording();
      clearTimer();
      updateState({
        recordingStatus: 'paused',
        isRecording: false,
      });
    }
  }, [updateState, clearTimer]);

  const resumeRecording = useCallback((): void => {
    if (recorderRef.current) {
      recorderRef.current.resumeRecording();
      startTimer();
      updateState({
        recordingStatus: 'recording',
        isRecording: true,
      });
    }
  }, [updateState, startTimer]);

  const saveRecording = useCallback((fileName?: string): void => {
    if (recorderRef.current) {
      const finalFileName = fileName || generateRecordingFileName('piano-recording');
      recorderRef.current.save(finalFileName);
    }
  }, []);

  const getBlob = useCallback((): Blob | undefined => {
    return recorderRef.current?.getBlob();
  }, []);

  const toggleRecord = useCallback((): void => {
    if (state.isRecording || state.recordingStatus === 'recording') {
      stopRecording((blob) => {
        if (blob) {
          downloadBlob(blob, generateRecordingFileName('piano-recording'));
        }
      });
    } else {
      startRecording();
    }
  }, [state.isRecording, state.recordingStatus, stopRecording, startRecording]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
      }
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
    };
  }, [clearTimer]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    saveRecording,
    getBlob,
    toggleRecord,
  };
};
