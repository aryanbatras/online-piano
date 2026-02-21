import { PianoKeyProps } from '@/types/piano';
import { usePianoKey } from '@/hooks/piano/key';
import styles from '@/styles/Piano.module.css';

export const PianoKey = ({ pianoKey, isActive, onPressed, onReleased, showKeyboardMappings, style }: PianoKeyProps) => {
  const { events, keyClasses, keyboardMapping } = usePianoKey(pianoKey, isActive, onPressed, onReleased, showKeyboardMappings);

  return (
    <div
      className={keyClasses}
      style={style}
      onMouseDown={events.handleMouseDown}
      onMouseUp={events.handleMouseUp}
      onMouseLeave={events.handleMouseLeave}
      onTouchStart={events.handleTouchStart}
      onTouchEnd={events.handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`Piano key ${pianoKey.note}`}
      data-key={pianoKey.keyboardKey}
      data-key-id={pianoKey.id}
    >
      <span className={styles.keyLabel}>
        {keyboardMapping && (
          <span className={styles.keyboardMapping}>
            {keyboardMapping}
          </span>
        )}
      </span>
    </div>
  )
};
