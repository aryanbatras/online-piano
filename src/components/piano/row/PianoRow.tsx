import { PianoRowProps } from "@/types/piano";
import { usePianoRow } from "@/hooks/piano/row";
import styles from "@/styles/Piano.module.css";
import { PianoKey } from "../key";

export const PianoRow = ({row,activeKeys,onPressed,onReleased,showKeyboardMappings}: PianoRowProps) => {
  const { whiteKeys, blackKeys, getBlackKeyStyle } = usePianoRow(row);

  return (
    <div className={styles.pianoRow}>
      <div className={styles.keysContainer}>
        {whiteKeys.map((pianoKey) => (
          <PianoKey
            key={pianoKey.id}
            pianoKey={pianoKey}
            isActive={activeKeys.has(pianoKey.id)}
            onPressed={onPressed}
            onReleased={onReleased}
            showKeyboardMappings={showKeyboardMappings}
          />
        ))}
        {blackKeys.map((pianoKey) => (
          <PianoKey
            key={pianoKey.id}
            pianoKey={pianoKey}
            isActive={activeKeys.has(pianoKey.id)}
            onPressed={onPressed}
            onReleased={onReleased}
            showKeyboardMappings={showKeyboardMappings}
            style={getBlackKeyStyle(pianoKey)}
          />
        ))}
      </div>
    </div>
  );
};
