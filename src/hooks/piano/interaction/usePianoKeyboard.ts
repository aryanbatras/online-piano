import { useEffect } from 'react';
import { useKeyboardMappings } from '../../useKeyboardMappings';

export function usePianoKeyboard(
  onKeyPressed: (keyId: number) => void,
  onKeyReleased: (keyId: number) => void,
) {
  const { handleKeyDown, handleKeyUp } = useKeyboardMappings(
    onKeyPressed,
    onKeyReleased,
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
