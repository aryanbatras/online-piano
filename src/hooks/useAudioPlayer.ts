import { useEffect, useRef, useCallback } from 'react';
import { AudioPlayer } from '@/types/piano';
import { pianoKeys } from '@/data/pianoData';

export const useAudioPlayer = (): AudioPlayer => {
  const audioCache = useRef<Map<number, HTMLAudioElement>>(new Map());
  const activeAudioNodes = useRef<Map<number, AudioBufferSourceNode>>(new Map());
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<Map<number, AudioBuffer>>(new Map());
  const isPreloaded = useRef(false);

  const initializeAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const preload = useCallback(async () => {
    if (isPreloaded.current) return;

    const ctx = initializeAudioContext();
    
    try {
      const loadPromises = pianoKeys.map(async (key) => {
        try {
          const response = await fetch(key.audioPath);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          audioBuffers.current.set(key.id, audioBuffer);
        } catch (error) {
          console.warn(`Failed to preload audio for key ${key.id}:`, error);
        }
      });

      await Promise.all(loadPromises);
      isPreloaded.current = true;
    } catch (error) {
      console.error('Error preloading audio:', error);
    }
  }, [initializeAudioContext]);

  const play = useCallback((keyId: number) => {
    const ctx = initializeAudioContext();
    const audioBuffer = audioBuffers.current.get(keyId);
    
    if (!audioBuffer) {
      console.warn(`No audio buffer found for key ${keyId}`);
      return;
    }

    try {
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);
      
      source.start(ctx.currentTime);
      source.stop(ctx.currentTime + audioBuffer.duration);
      
      activeAudioNodes.current.set(keyId, source);
      
      source.onended = () => {
        activeAudioNodes.current.delete(keyId);
      };
    } catch (error) {
      console.error(`Error playing key ${keyId}:`, error);
    }
  }, [initializeAudioContext]);

  const stop = useCallback((keyId: number) => {
    const activeSource = activeAudioNodes.current.get(keyId);
    
    if (activeSource) {
      try {
        const ctx = initializeAudioContext();
        const gainNode = ctx.createGain();
        
        activeSource.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        setTimeout(() => {
          try {
            activeSource.stop();
          } catch (e) {
          }
          activeAudioNodes.current.delete(keyId);
        }, 100);
      } catch (error) {
        console.error(`Error stopping key ${keyId}:`, error);
      }
    }
  }, [initializeAudioContext]);

  useEffect(() => {
    preload();
    
    return () => {
      activeAudioNodes.current.forEach(source => {
        try {
          source.stop();
        } catch (e) {
        }
      });
      activeAudioNodes.current.clear();
    };
  }, [preload]);

  return { play, stop, preload };
};
