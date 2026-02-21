import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

export default function ConnectionTest() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [events, setEvents] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [currentRoom, setCurrentRoom] = useState('');

  useEffect(() => {
    // Initialize socket server by making a request to the socket API
    fetch('/api/socket').catch(err => {
      console.log('Socket server initialization error (expected):', err);
    });

    // Debug: Log all events
    socket.onAny((eventName, ...args) => {
      console.log('Received event:', eventName, args);
    });

    function onConnect() {
      setIsConnected(true);
      addEvent('Connected to server');
    }

    function onDisconnect() {
      setIsConnected(false);
      addEvent('Disconnected from server');
    }

    function onPong(data: string) {
      addEvent(`Received pong: ${data}`);
    }

    function onConnectError(error: any) {
      addEvent(`Connection error: ${error.message}`);
      console.error('Socket connection error:', error);
    }

    function onUserCount(count: number) {
      setUserCount(count);
      addEvent(`Room users: ${count}`);
    }

    function onUserJoined(userId: string) {
      addEvent(`User joined: ${userId}`);
    }

    function onUserLeft(userId: string) {
      addEvent(`User left: ${userId}`);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('pong', onPong);
    socket.on('connect_error', onConnectError);
    socket.on('user-count', onUserCount);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('pong', onPong);
      socket.off('connect_error', onConnectError);
      socket.off('user-count', onUserCount);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
    };
  }, []);

  function addEvent(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(previous => [...previous, `${timestamp}: ${message}`]);
  }

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  function testPing() {
    addEvent('Sending ping to server');
    socket.emit('ping', 'Hello from client!');
  }

  function showDebugInfo() {
    addEvent(`Socket connected: ${socket.connected}`);
    addEvent(`Socket ID: ${socket.id || 'None'}`);
    addEvent(`Transport: ${socket.io.engine?.transport?.name || 'None'}`);
  }

  function joinRoom() {
    if (roomId.trim()) {
      socket.emit('join-room', roomId.trim());
      setCurrentRoom(roomId.trim());
      addEvent(`Joining room: ${roomId.trim()}`);
    }
  }

  function leaveRoom() {
    if (currentRoom) {
      socket.emit('leave-room', currentRoom);
      addEvent(`Leaving room: ${currentRoom}`);
      setCurrentRoom('');
      setUserCount(0);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Socket.IO Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Connection Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
        <p><strong>Socket ID:</strong> {socket.id || 'Not connected'}</p>
        <p><strong>Current Room:</strong> {currentRoom || 'None'}</p>
        <p><strong>Users in Room:</strong> {userCount}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={connect} disabled={isConnected} style={{ marginRight: '10px', padding: '10px' }}>
          Connect
        </button>
        <button onClick={disconnect} disabled={!isConnected} style={{ marginRight: '10px', padding: '10px' }}>
          Disconnect
        </button>
        <button onClick={testPing} disabled={!isConnected} style={{ marginRight: '10px', padding: '10px' }}>
          Send Ping
        </button>
        <button onClick={showDebugInfo} style={{ marginRight: '10px', padding: '10px' }}>
          Debug Info
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ marginRight: '10px', padding: '10px', width: '200px' }}
        />
        <button onClick={joinRoom} disabled={!isConnected || !roomId.trim()} style={{ marginRight: '10px', padding: '10px' }}>
          Join Room
        </button>
        <button onClick={leaveRoom} disabled={!currentRoom} style={{ padding: '10px' }}>
          Leave Room
        </button>
      </div>

      <div>
        <h3>Event Log:</h3>
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          height: '300px', 
          overflowY: 'auto',
          backgroundColor: 'black',
          fontFamily: 'monospace'
        }}>
          {events.length === 0 ? (
            <p style={{ color: 'white' }}>No events yet. Click "Connect" to start.</p>
          ) : (
            events.map((event, index) => (
              <div key={index} style={{ marginBottom: '5px', color: '#00ff00' }}>
                {event}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
