import styles from '../../../styles/Piano.module.css';
import { PianoKey as PianoKeyType } from '@/types/piano';

export function useKeyClasses(
  pianoKey: PianoKeyType,
  isActive: boolean
) {
  const keyClasses = [
    styles.pianoKey,
    styles[pianoKey.type],
    isActive && styles.active
  ].filter(Boolean).join(' ');

  return keyClasses;
}
