import { usePianoInteraction } from '../interaction/usePianoInteraction';
import { usePianoKeyboard } from '../interaction/usePianoKeyboard';

export function usePianoSystem(emitKeyPress?: (keyId: number) => void, emitKeyRelease?: (keyId: number) => void) {
  const { activeKeys, handleKeyPressed, handleKeyReleased } = usePianoInteraction(emitKeyPress, emitKeyRelease);
  usePianoKeyboard(handleKeyPressed, handleKeyReleased);
  return { activeKeys, handleKeyPressed, handleKeyReleased };
}
