import { usePianoInteraction } from '../interaction/usePianoInteraction';
import { usePianoKeyboard } from '../interaction/usePianoKeyboard';

export function usePianoSystem() {
  const { activeKeys, handleKeyPressed, handleKeyReleased } = usePianoInteraction();
  usePianoKeyboard(handleKeyPressed, handleKeyReleased);
  return { activeKeys, handleKeyPressed, handleKeyReleased };
}
