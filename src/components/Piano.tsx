import { useState, useEffect, useCallback } from 'react';
import { pianoRows } from '@/data/pianoData';
import { findPianoKeyByKeyCode } from '@/data/pianoData';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { PianoRow } from './PianoRow';
import styles from '../styles/Piano.module.css';

export default function Piano() {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [showKeyboardMappings, setShowKeyboardMappings] = useState(true);
  const { play, stop, preload } = useAudioPlayer();

  const handleKeyPressed = useCallback((keyId: number) => {
    setActiveKeys(prev => new Set(prev).add(keyId));
    play(keyId);
  }, [play]);

  const handleKeyReleased = useCallback((keyId: number) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(keyId);
      return newSet;
    });
    stop(keyId);
  }, [stop]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;
    
    const pianoKey = findPianoKeyByKeyCode(e.key, e.shiftKey);
    if (pianoKey) {
      handleKeyPressed(pianoKey.id);
    }
  }, [handleKeyPressed]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const pianoKey = findPianoKeyByKeyCode(e.key, e.shiftKey);
    if (pianoKey) {
      handleKeyReleased(pianoKey.id);
    }
  }, [handleKeyReleased]);

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

  return (
    <div className={styles.pianoContainer}>
      <div className={styles.pianoTitle}>
        Virtual Piano
      </div>
      <div className={styles.toggleContainer}>
        <button
          className={styles.toggleButton}
          onClick={() => setShowKeyboardMappings(!showKeyboardMappings)}
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
