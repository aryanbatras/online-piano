import { PianoKey as PianoKeyType } from '@/types/piano';

export function useKeyboardMapping(
  pianoKey: PianoKeyType,
  showKeyboardMappings: boolean
) {
  if (!showKeyboardMappings || !pianoKey.keyboardKey) {
    return null;
  }

  return pianoKey.type === 'black' 
    ? pianoKey.keyboardKey.toUpperCase() 
    : pianoKey.keyboardKey.toLowerCase();
}
