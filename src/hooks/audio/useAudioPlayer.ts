import { useEffect, useRef, useCallback, useState } from 'react';
import { AudioPlayer } from '@/types/piano';
import { pianoKeys } from '@/data/pianoData';
import { createAudioContext } from '@/utils';
import { AudioPlayerState, AudioPlayerActions } from '@/types/audio';

interface AudioNodeManager {
  activeNodes: Map<string, AudioBufferSourceNode>;
  audioBuffers: Map<number, AudioBuffer>;
  context: AudioContext | null;
  convolverNode: ConvolverNode | null;
  masterGainNode: GainNode | null;
  reverbGainNode: GainNode | null;
}

const DEFAULT_VOLUME = 0.3;
const FADE_OUT_DURATION = 3.0;
const STOP_FADE_DURATION = 0.3;

export const useAudioPlayer = (): AudioPlayer & AudioPlayerState & AudioPlayerActions => {
  const managerRef = useRef<AudioNodeManager>({
    activeNodes: new Map(),
    audioBuffers: new Map(),
    context: null,
    convolverNode: null,
    masterGainNode: null,
    reverbGainNode: null,
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
      
      const context = managerRef.current.context;
      
      const convolverNode = context.createConvolver();
      const length = context.sampleRate * 4;
      const impulse = context.createBuffer(2, length, context.sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          const decay = Math.pow(1 - i / length, 3);
          const random = Math.random() * 2 - 1;
          channelData[i] = random * decay * 0.5;
        }
      }
      
      convolverNode.buffer = impulse;
      
      const masterGainNode = context.createGain();
      masterGainNode.gain.value = DEFAULT_VOLUME;
      
      const reverbGainNode = context.createGain();
      reverbGainNode.gain.value = 0.4;
      
      convolverNode.connect(reverbGainNode);
      reverbGainNode.connect(masterGainNode);
      masterGainNode.connect(context.destination);
      
      managerRef.current.convolverNode = convolverNode;
      managerRef.current.masterGainNode = masterGainNode;
      managerRef.current.reverbGainNode = reverbGainNode;
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

  const preload = useCallback(async (priorityKeys: number[] = []): Promise<void> => {
    if (isPreloadedRef.current || isLoadingRef.current) return;

    isLoadingRef.current = true;
    updateState({ isLoading: true, error: null });

    try {
      const context = getAudioContext();
      
      // Load priority keys first (first octave for immediate interaction)
      const keysToLoad = priorityKeys.length > 0 
        ? priorityKeys 
        : pianoKeys.slice(0, 12).map(key => key.id); // First octave only
      
      const loadPromises = keysToLoad.map(async (keyId) => {
        try {
          const pianoKey = pianoKeys.find(key => key.id === keyId);
          if (!pianoKey) return;
          
          const audioBuffer = await loadAudioBuffer(pianoKey.audioPath, context);
          managerRef.current.audioBuffers.set(keyId, audioBuffer);
        } catch (error) {
          console.warn(`Failed to preload audio for key ${keyId}:`, error);
        }
      });

      await Promise.all(loadPromises);
      
      // Mark as preloaded for priority keys only
      updateState({ isPreloaded: true });
      
      // Load remaining keys in background with lower priority
      setTimeout(() => {
        const remainingKeys = pianoKeys.filter(key => !keysToLoad.includes(key.id));
        remainingKeys.forEach(async (pianoKey) => {
          try {
            const audioBuffer = await loadAudioBuffer(pianoKey.audioPath, context);
            managerRef.current.audioBuffers.set(pianoKey.id, audioBuffer);
          } catch (error) {
            console.warn(`Failed to load background audio for key ${pianoKey.id}:`, error);
          }
        });
      }, 1000);
      
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
    let audioBuffer = managerRef.current.audioBuffers.get(keyId);

    // Load audio on-demand if not already loaded
    if (!audioBuffer) {
      const pianoKey = pianoKeys.find(key => key.id === keyId);
      if (pianoKey) {
        loadAudioBuffer(pianoKey.audioPath, context)
          .then(buffer => {
            managerRef.current.audioBuffers.set(keyId, buffer);
            playSound(keyId, buffer, context);
          })
          .catch(error => {
            console.warn(`Failed to load audio for key ${keyId}:`, error);
          });
        return;
      }
    }
    
    if (audioBuffer) {
      playSound(keyId, audioBuffer, context);
    }
  }, [getAudioContext, loadAudioBuffer]);

  const playSound = useCallback((keyId: number, audioBuffer: AudioBuffer, context: AudioContext): void => {

    try {
      const source = context.createBufferSource();
      const directGainNode = createGainNode(context, 0.6);
      const reverbGainNode = createGainNode(context, 0.4);
      const nodeId = `${keyId}-${Date.now()}-${Math.random()}`;

      source.buffer = audioBuffer;
      
      source.connect(directGainNode);
      directGainNode.connect(context.destination);
      
      // Only add reverb for desktop devices (performance optimization)
      if (managerRef.current.convolverNode && managerRef.current.reverbGainNode && window.innerWidth > 768) {
        source.connect(reverbGainNode);
        reverbGainNode.connect(managerRef.current.convolverNode);
      }

      directGainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + FADE_OUT_DURATION);
      reverbGainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + FADE_OUT_DURATION);

      source.start(context.currentTime);
      source.stop(context.currentTime + audioBuffer.duration);

      managerRef.current.activeNodes.set(nodeId, source);

      source.onended = () => {
        managerRef.current.activeNodes.delete(nodeId);
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to play key ${keyId}`;
      updateState({ error: errorMessage });
      console.error(`Error playing key ${keyId}:`, error);
    }
  }, [createGainNode, updateState]);

  const stop = useCallback((keyId: number): void => {
    const nodesToStop: string[] = [];
    
    managerRef.current.activeNodes.forEach((source, nodeId) => {
      if (nodeId.startsWith(`${keyId}-`)) {
        nodesToStop.push(nodeId);
      }
    });

    if (nodesToStop.length === 0) return;

    try {
      const context = getAudioContext();
      
      nodesToStop.forEach(nodeId => {
        const activeSource = managerRef.current.activeNodes.get(nodeId);
        if (!activeSource) return;

        const stopGainNode = createGainNode(context);
        activeSource.connect(stopGainNode);
        stopGainNode.connect(context.destination);

        stopGainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + STOP_FADE_DURATION);

        setTimeout(() => {
          try {
            activeSource.stop();
          } catch (error) {
          }
          managerRef.current.activeNodes.delete(nodeId);
        }, STOP_FADE_DURATION * 1000);
      });
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
