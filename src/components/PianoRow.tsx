import { useState, useEffect } from 'react';
import { PianoRow as PianoRowType } from '@/types/piano';
import { PianoKey } from './PianoKey';
import styles from '../styles/Piano.module.css';

interface PianoRowProps {
  row: PianoRowType;
  activeKeys: Set<number>;
  onPressed: (keyId: number) => void;
  onReleased: (keyId: number) => void;
  showKeyboardMappings: boolean;
}

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

export const PianoRow = ({ 
  row, 
  activeKeys, 
  onPressed, 
  onReleased, 
  showKeyboardMappings 
}: PianoRowProps) => {
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  const whiteKeys = row.keys
    .filter(key => key.type === 'white')
    .sort((a, b) => a.position - b.position);
  
  const blackKeys = row.keys
    .filter(key => key.type === 'black')
    .sort((a, b) => a.position - b.position);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const whiteKeyWidth = getWhiteKeyWidth(windowWidth);

  return (
    <div className={styles.pianoRow}>
      <div className={styles.keysContainer}>
        {whiteKeys.map(pianoKey => (
          <PianoKey
            key={pianoKey.id}
            pianoKey={pianoKey}
            isActive={activeKeys.has(pianoKey.id)}
            onPressed={onPressed}
            onReleased={onReleased}
            showKeyboardMappings={showKeyboardMappings}
          />
        ))}
        {blackKeys.map(pianoKey => (
          <PianoKey
            key={pianoKey.id}
            pianoKey={pianoKey}
            isActive={activeKeys.has(pianoKey.id)}
            onPressed={onPressed}
            onReleased={onReleased}
            showKeyboardMappings={showKeyboardMappings}
            style={{ 
              left: `${getBlackKeyPosition(pianoKey, whiteKeys, whiteKeyWidth)}px` 
            }}
          />
        ))}
      </div>
    </div>
  );
};
