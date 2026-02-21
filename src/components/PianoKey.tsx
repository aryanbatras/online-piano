import React from 'react';
import { PianoKey as PianoKeyType } from '@/types/piano';
import styles from '../styles/Piano.module.css';

interface PianoKeyProps {
  pianoKey: PianoKeyType;
  isActive: boolean;
  onPressed: (keyId: number) => void;
  onReleased: (keyId: number) => void;
  showKeyboardMappings: boolean;
  style?: React.CSSProperties;
}

export const PianoKey: React.FC<PianoKeyProps> = ({ pianoKey, isActive, onPressed, onReleased, showKeyboardMappings, style }) => {
  const handleMouseDown = () => {
    onPressed(pianoKey.id);
  };

  const handleMouseUp = () => {
    onReleased(pianoKey.id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onPressed(pianoKey.id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    onReleased(pianoKey.id);
  };

  const keyClasses = [
    styles.pianoKey,
    styles[pianoKey.type],
    isActive ? styles.active : ''
  ].filter(Boolean).join(' ');

  const combinedStyle = {
    ...style
  };

  return (
    <div
      className={keyClasses}
      style={combinedStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`Piano key ${pianoKey.note}`}
      data-key={pianoKey.keyboardKey}
      data-key-id={pianoKey.id}
    >
      <span className={styles.keyLabel}>
        {showKeyboardMappings && pianoKey.keyboardKey && (
          <span className={styles.keyboardMapping}>
            {pianoKey.type === 'black' ? pianoKey.keyboardKey.toUpperCase() : pianoKey.keyboardKey.toLowerCase()}
          </span>
        )}
      </span>
    </div>
  );
};
