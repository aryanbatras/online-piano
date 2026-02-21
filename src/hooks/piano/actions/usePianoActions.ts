import { useEffect } from 'react';
import { useAudioPlayer } from '../../useAudioPlayer';

export function usePianoActions() {
  const { play, stop, preload } = useAudioPlayer();
  
  const keyPressed = (keyId: number) => play(keyId);
  const keyReleased = (keyId: number) => stop(keyId);
  
  useEffect(() => {
    preload();
  }, [preload]);
  
  return { keyPressed, keyReleased };
}
