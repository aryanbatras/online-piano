import React, { useState, useEffect } from 'react';
import { pianoRows } from "@/data/pianoData";
import { useAudioRecorder } from "@/hooks/audio/useAudioRecorder";
import { usePianoUI, usePianoSystem } from "@/hooks/piano";
import { usePianoSocket } from "@/hooks/socket/usePianoSocket";
import { socket } from '../../socket';
import styles from "@/styles/Piano.module.css";
import { PianoRow } from "./row";

export default function CollaborativePiano() {
  const [roomId, setRoomId] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const { remoteActiveKeys, isConnected: socketConnected, emitKeyPress, emitKeyRelease } = usePianoSocket(currentRoom);
  const { activeKeys, handleKeyPressed, handleKeyReleased } = usePianoSystem(emitKeyPress, emitKeyRelease);
  const { toggleKeyMap, showKeyMap } = usePianoUI();
  const { toggleRecord, isRecording } = useAudioRecorder();

  useEffect(() => {
    fetch('/api/socket').catch(err => {
      console.log('Socket server initialization error (expected):', err);
    });

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setUserCount(0);
    }

    function onUserCount(count: number) {
      setUserCount(count);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('user-count', onUserCount);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('user-count', onUserCount);
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim() && isConnected) {
      socket.emit('join-room', roomId.trim());
      setCurrentRoom(roomId.trim());
    }
  };

  const leaveRoom = () => {
    if (currentRoom) {
      socket.emit('leave-room', currentRoom);
      setCurrentRoom('');
      setUserCount(0);
    }
  };

  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
    setCurrentRoom('');
    setUserCount(0);
  };

  const isKeyActive = (keyId: number) => {
    return activeKeys.has(keyId) || remoteActiveKeys.has(keyId);
  };

  const isRemoteKey = (keyId: number) => {
    return remoteActiveKeys.has(keyId);
  };

  return (
    <div className={styles.pianoContainer}>
      <div className={styles.pianoTitle}>Collaborative Virtual Piano</div>
      
      <div className={styles.roomControls}>
        <div className={styles.connectionStatus}>
          <span>{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
          {currentRoom && (
            <span className={styles.roomInfo}>
              Room: {currentRoom} | Users: {userCount}
            </span>
          )}
        </div>
        
        <div className={styles.connectionButtons}>
          <button 
            onClick={connect} 
            disabled={isConnected}
            className={styles.roomButton}
          >
            Connect
          </button>
          <button 
            onClick={disconnect} 
            disabled={!isConnected}
            className={styles.roomButton}
          >
            Disconnect
          </button>
        </div>
        
        <div className={styles.roomJoin}>
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={styles.roomInput}
          />
          <button 
            onClick={joinRoom} 
            disabled={!isConnected || !roomId.trim()}
            className={styles.roomButton}
          >
            Join Room
          </button>
          <button 
            onClick={leaveRoom} 
            disabled={!currentRoom}
            className={styles.roomButton}
          >
            Leave Room
          </button>
        </div>
      </div>

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
            remoteActiveKeys={remoteActiveKeys}
            onPressed={handleKeyPressed}
            onReleased={handleKeyReleased}
            showKeyboardMappings={showKeyMap}
          />
        ))}
      </div>
    </div>
  );
}
