import { findPianoKeyByKeyCode, pianoKeys } from '@/data/pianoData';

export const useKeyboardMappings = (onKeyPressed: (keyId: number) => void, onKeyReleased: (keyId: number) => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    
    const pianoKey = findPianoKeyByKeyCode(e.key, e.shiftKey, pianoKeys);
    if (pianoKey) {
      onKeyPressed(pianoKey.id);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const pianoKey = findPianoKeyByKeyCode(e.key, e.shiftKey, pianoKeys);
    if (pianoKey) {
      onKeyReleased(pianoKey.id);
    }
  };

  return { handleKeyDown, handleKeyUp };
};
 