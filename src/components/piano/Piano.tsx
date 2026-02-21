import { pianoRows } from "@/data/pianoData";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { usePianoSystem, usePianoUI } from "@/hooks/piano";
import styles from "@/styles/Piano.module.css";
import { PianoRow } from "./row";

export default function Piano() {
  const { activeKeys, handleKeyPressed, handleKeyReleased } = usePianoSystem();
  const { toggleKeyMap, showKeyMap } = usePianoUI();
  const { toggleRecord, isRecording } = useAudioRecorder();
  return (
    <div className={styles.pianoContainer}>
      <div className={styles.pianoTitle}>Virtual Piano</div>
      <div className={styles.toggleContainer}>
        <button className={styles.toggleButton} onClick={toggleKeyMap}>
          {showKeyMap ? "Hide" : "Show"} Keyboard Mappings
        </button>
        <button className={styles.toggleButton} onClick={toggleRecord}>
          {isRecording ? "Stop" : "Start"} Recording
        </button>
      </div>
      <div className={styles.piano}>
        {pianoRows.map((row) => (
          <PianoRow
            key={row.rowNumber}
            row={row}
            activeKeys={activeKeys}
            onPressed={handleKeyPressed}
            onReleased={handleKeyReleased}
            showKeyboardMappings={showKeyMap}
          />
        ))}
      </div>
    </div>
  );
}
