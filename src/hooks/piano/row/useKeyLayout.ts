import { PianoRow as PianoRowType } from '@/types/piano';

const getWhiteKeyWidth = (windowWidth: number): number => {
  if (windowWidth <= 480) return 30;
  if (windowWidth <= 768) return 38;
  return 48;
};

const getBlackKeyPosition = (
  blackKey: any, 
  whiteKeys: any[], 
  whiteKeyWidth: number
): number => {
  const whiteKeyIndex = whiteKeys.findIndex(whiteKey => whiteKey.position > blackKey.position);
  const targetWhiteKey = whiteKeyIndex === -1 
    ? whiteKeys[whiteKeys.length - 1] 
    : whiteKeys[whiteKeyIndex];
  const targetWhiteKeyIndex = whiteKeys.indexOf(targetWhiteKey);
  return targetWhiteKeyIndex * whiteKeyWidth + whiteKeyWidth - 16;
};

export function useKeyLayout(row: PianoRowType, windowWidth: number) {
  const whiteKeys = row.keys
    .filter(key => key.type === 'white')
    .sort((a, b) => a.position - b.position);
  
  const blackKeys = row.keys
    .filter(key => key.type === 'black')
    .sort((a, b) => a.position - b.position);

  const whiteKeyWidth = getWhiteKeyWidth(windowWidth);

  const getBlackKeyStyle = (blackKey: any) => ({
    left: `${getBlackKeyPosition(blackKey, whiteKeys, whiteKeyWidth)}px`
  });

  return {
    whiteKeys,
    blackKeys,
    whiteKeyWidth,
    getBlackKeyStyle
  };
}
