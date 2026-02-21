import { usePianoState } from '../state/usePianoState';
import { usePianoActions } from '../actions/usePianoActions';

export function usePianoInteraction() {
  const { activeKeys, setActiveKeys } = usePianoState();
  const { keyPressed, keyReleased } = usePianoActions();
  
  const handleKeyPressed = (keyId: number) => {
    setActiveKeys(prev => new Set(prev).add(keyId));
    keyPressed(keyId);
  };
  
  const handleKeyReleased = (keyId: number) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(keyId);
      return newSet;
    });
    keyReleased(keyId);
  };
  
  return { activeKeys, handleKeyPressed, handleKeyReleased };
}
