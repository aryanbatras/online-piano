import { useState, useEffect } from 'react';
import { pianoRows } from '@/data/pianoData';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardMappings } from '@/hooks/useKeyboardMappings';
import { PianoRow } from './PianoRow';
import styles from '../styles/Piano.module.css';

export default function Piano() {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [showKeyboardMappings, setShowKeyboardMappings] = useState(true);
  const { play, stop, preload } = useAudioPlayer(); 

  const handleKeyPressed = (keyId: number) => {
    setActiveKeys(prev => new Set(prev).add(keyId));
    play(keyId);
  };

  const handleKeyReleased = (keyId: number) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(keyId);
      return newSet;
    });
    stop(keyId);
  };

  const { handleKeyDown, handleKeyUp } = useKeyboardMappings(handleKeyPressed, handleKeyReleased);

  useEffect(() => {
    preload();
  }, [preload]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const toggleKeyboardMappings = () => {
    setShowKeyboardMappings(prev => !prev);
  };

  return (
    <div className={styles.pianoContainer}>
      <div className={styles.pianoTitle}>
        Virtual Piano
      </div>
      <div className={styles.toggleContainer}>
        <button
          className={styles.toggleButton}
          onClick={toggleKeyboardMappings}
          aria-label={showKeyboardMappings ? 'Hide keyboard mappings' : 'Show keyboard mappings'}
        >
          {showKeyboardMappings ? 'Hide' : 'Show'} Keyboard Mappings
        </button>
      </div>
      <div className={styles.piano}>
        {pianoRows.map(row => (
          <PianoRow
            key={row.rowNumber}
            row={row}
            activeKeys={activeKeys}
            onPressed={handleKeyPressed}
            onReleased={handleKeyReleased}
            showKeyboardMappings={showKeyboardMappings}
          />
        ))}
      </div>
    </div>
  );
}
