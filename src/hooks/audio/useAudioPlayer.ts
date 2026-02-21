import { useEffect, useRef, useCallback, useState } from 'react';
import { AudioPlayer } from '@/types/piano';
import { pianoKeys } from '@/data/pianoData';
import { createAudioContext } from '@/utils';
import { AudioPlayerState, AudioPlayerActions } from '@/types/audio';

interface AudioNodeManager {
  activeNodes: Map<number, AudioBufferSourceNode>;
  audioBuffers: Map<number, AudioBuffer>;
  context: AudioContext | null;
}

const DEFAULT_VOLUME = 0.3;
const FADE_OUT_DURATION = 2.0;
const STOP_FADE_DURATION = 0.1;

export const useAudioPlayer = (): AudioPlayer & AudioPlayerState & AudioPlayerActions => {
  const managerRef = useRef<AudioNodeManager>({
    activeNodes: new Map(),
    audioBuffers: new Map(),
    context: null,
  });

  const isPreloadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const [state, setState] = useState<AudioPlayerState>({
    isPreloaded: false,
    isLoading: false,
    error: null,
  });

  const updateState = useCallback((updates: Partial<AudioPlayerState>) => {
    setState((prev: AudioPlayerState) => ({ ...prev, ...updates }));
  }, []);

  const getAudioContext = useCallback((): AudioContext => {
    if (!managerRef.current.context) {
      managerRef.current.context = createAudioContext();
    }
    return managerRef.current.context;
  }, []);

  const createGainNode = useCallback((context: AudioContext, initialValue: number = DEFAULT_VOLUME): GainNode => {
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(initialValue, context.currentTime);
    return gainNode;
  }, []);

  const loadAudioBuffer = useCallback(async (audioPath: string, context: AudioContext): Promise<AudioBuffer> => {
    const response = await fetch(audioPath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
  }, []);

  const preload = useCallback(async (): Promise<void> => {
    if (isPreloadedRef.current || isLoadingRef.current) return;

    isLoadingRef.current = true;
    updateState({ isLoading: true, error: null });

    try {
      const context = getAudioContext();
      const loadPromises = pianoKeys.map(async (key) => {
        try {
          const audioBuffer = await loadAudioBuffer(key.audioPath, context);
          managerRef.current.audioBuffers.set(key.id, audioBuffer);
        } catch (error) {
          console.warn(`Failed to preload audio for key ${key.id}:`, error);
        }
      });

      await Promise.all(loadPromises);
      isPreloadedRef.current = true;
      updateState({ isPreloaded: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to preload audio';
      updateState({ error: errorMessage });
      console.error('Error preloading audio:', error);
    } finally {
      isLoadingRef.current = false;
      updateState({ isLoading: false });
    }
  }, [getAudioContext, loadAudioBuffer, updateState]);

  const play = useCallback((keyId: number): void => {
    const context = getAudioContext();
    const audioBuffer = managerRef.current.audioBuffers.get(keyId);

    if (!audioBuffer) {
      console.warn(`No audio buffer found for key ${keyId}`);
      return;
    }

    try {
      const source = context.createBufferSource();
      const gainNode = createGainNode(context);

      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(context.destination);

      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + FADE_OUT_DURATION);

      source.start(context.currentTime);
      source.stop(context.currentTime + audioBuffer.duration);

      managerRef.current.activeNodes.set(keyId, source);

      source.onended = () => {
        managerRef.current.activeNodes.delete(keyId);
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to play key ${keyId}`;
      updateState({ error: errorMessage });
      console.error(`Error playing key ${keyId}:`, error);
    }
  }, [getAudioContext, createGainNode, updateState]);

  const stop = useCallback((keyId: number): void => {
    const activeSource = managerRef.current.activeNodes.get(keyId);

    if (!activeSource) return;

    try {
      const context = getAudioContext();
      const gainNode = createGainNode(context);

      activeSource.connect(gainNode);
      gainNode.connect(context.destination);

      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + STOP_FADE_DURATION);

      setTimeout(() => {
        try {
          activeSource.stop();
        } catch (error) {
        }
        managerRef.current.activeNodes.delete(keyId);
      }, STOP_FADE_DURATION * 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to stop key ${keyId}`;
      updateState({ error: errorMessage });
      console.error(`Error stopping key ${keyId}:`, error);
    }
  }, [getAudioContext, createGainNode, updateState]);

  const cleanup = useCallback((): void => {
    managerRef.current.activeNodes.forEach((source) => {
      try {
        source.stop();
      } catch (error) {
      }
    });
    managerRef.current.activeNodes.clear();
  }, []);

  useEffect(() => {
    preload();

    return cleanup;
  }, [preload, cleanup]);

  return {
    ...state,
    play,
    stop,
    preload,
  };
};
