import { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { useAudioPlayer } from '../audio/useAudioPlayer';

interface RemoteKeyEvent {
  keyId: number;
  userId: string;
  timestamp: number;
}

export function usePianoSocket(currentRoom: string) {
  const [remoteActiveKeys, setRemoteActiveKeys] = useState<Map<number, string>>(new Map());
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { play, stop } = useAudioPlayer();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setRemoteActiveKeys(new Map());
    }

    function onRemoteKeyPress(data: RemoteKeyEvent) {
      setRemoteActiveKeys(prev => new Map(prev).set(data.keyId, data.userId));
      play(data.keyId);
    }

    function onRemoteKeyRelease(data: RemoteKeyEvent) {
      setRemoteActiveKeys(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.keyId);
        return newMap;
      });
      stop(data.keyId);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('remote-key-press', onRemoteKeyPress);
    socket.on('remote-key-release', onRemoteKeyRelease);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('remote-key-press', onRemoteKeyPress);
      socket.off('remote-key-release', onRemoteKeyRelease);
    };
  }, [play, stop]);

  const emitKeyPress = (keyId: number) => {
    if (isConnected && currentRoom && socket.id) {
      socket.emit('piano-key-press', {
        roomId: currentRoom,
        keyId,
        userId: socket.id
      });
    }
  };

  const emitKeyRelease = (keyId: number) => {
    if (isConnected && currentRoom && socket.id) {
      socket.emit('piano-key-release', {
        roomId: currentRoom,
        keyId,
        userId: socket.id
      });
    }
  };

  return {
    remoteActiveKeys,
    isConnected,
    emitKeyPress,
    emitKeyRelease
  };
}
