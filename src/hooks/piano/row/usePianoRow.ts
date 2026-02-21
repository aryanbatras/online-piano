import { useWindowResize } from './useWindowResize';
import { useKeyLayout } from './useKeyLayout';
import { PianoRow as PianoRowType } from '@/types/piano';

export function usePianoRow(row: PianoRowType) {
  const windowWidth = useWindowResize();
  const layout = useKeyLayout(row, windowWidth);

  return {
    ...layout,
    windowWidth
  };
}
