import { useKeyEvents } from './useKeyEvents';
import { useKeyClasses } from './useKeyClasses';
import { useKeyboardMapping } from './useKeyboardMapping';
import { PianoKey as PianoKeyType } from '@/types/piano';

export function usePianoKey(
  pianoKey: PianoKeyType,
  isActive: boolean,
  onPressed: (keyId: number) => void,
  onReleased: (keyId: number) => void,
  showKeyboardMappings: boolean
) {
  const events = useKeyEvents(pianoKey.id, onPressed, onReleased);
  const keyClasses = useKeyClasses(pianoKey, isActive);
  const keyboardMapping = useKeyboardMapping(pianoKey, showKeyboardMappings);

  return {
    events,
    keyClasses,
    keyboardMapping
  };
}
