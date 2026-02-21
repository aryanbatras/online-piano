import { PianoRowProps } from "@/types/piano";
import { usePianoRow } from "@/hooks/piano/row";
import styles from "@/styles/Piano.module.css";
import { PianoKey } from "../key";

export const PianoRow = ({row,activeKeys,remoteActiveKeys,onPressed,onReleased,showKeyboardMappings}: PianoRowProps) => {
  const { whiteKeys, blackKeys, getBlackKeyStyle } = usePianoRow(row);

  const isKeyActive = (keyId: number) => {
    return activeKeys.has(keyId) || (remoteActiveKeys && remoteActiveKeys.has(keyId));
  };

  const isRemoteKey = (keyId: number) => {
    return remoteActiveKeys?.has(keyId) || false;
  };

  return (
    <div className={styles.pianoRow}>
      <div className={styles.keysContainer}>
        {whiteKeys.map((pianoKey) => (
          <PianoKey
            key={pianoKey.id}
            pianoKey={pianoKey}
            isActive={isKeyActive(pianoKey.id) || false}
            isRemote={isRemoteKey(pianoKey.id) || false}
            onPressed={onPressed}
            onReleased={onReleased}
            showKeyboardMappings={showKeyboardMappings}
          />
        ))}
        {blackKeys.map((pianoKey) => (
          <PianoKey
            key={pianoKey.id}
            pianoKey={pianoKey}
            isActive={isKeyActive(pianoKey.id) || false}
            isRemote={isRemoteKey(pianoKey.id) || false}
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
