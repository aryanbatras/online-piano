import React, { memo, useMemo, useCallback } from 'react';
import { PianoRowProps } from "@/types/piano";
import { usePianoRow } from "@/hooks/piano/row";
import styles from "@/styles/Piano.module.css";
import { PianoKey } from "../key";

export const PianoRow = memo(({row,activeKeys,remoteActiveKeys,onPressed,onReleased,showKeyboardMappings}: PianoRowProps) => {
  const { whiteKeys, blackKeys, getBlackKeyStyle } = usePianoRow(row);

  const isKeyActive = useCallback((keyId: number) => {
    return activeKeys.has(keyId) || (remoteActiveKeys && remoteActiveKeys.has(keyId));
  }, [activeKeys, remoteActiveKeys]);

  const isRemoteKey = useCallback((keyId: number) => {
    return remoteActiveKeys?.has(keyId) || false;
  }, [remoteActiveKeys]);

  const memoizedWhiteKeys = useMemo(() => 
    whiteKeys.map((pianoKey) => (
      <PianoKey
        key={pianoKey.id}
        pianoKey={pianoKey}
        isActive={isKeyActive(pianoKey.id) || false}
        isRemote={isRemoteKey(pianoKey.id) || false}
        onPressed={onPressed}
        onReleased={onReleased}
        showKeyboardMappings={showKeyboardMappings}
      />
    )), [whiteKeys, isKeyActive, isRemoteKey, onPressed, onReleased, showKeyboardMappings]
  );

  const memoizedBlackKeys = useMemo(() => 
    blackKeys.map((pianoKey) => (
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
    )), [blackKeys, isKeyActive, isRemoteKey, onPressed, onReleased, showKeyboardMappings, getBlackKeyStyle]
  );

  return (
    <div className={styles.pianoRow}>
      <div className={styles.keysContainer}>
        {memoizedWhiteKeys}
        {memoizedBlackKeys}
      </div>
    </div>
  );
});

PianoRow.displayName = 'PianoRow';
