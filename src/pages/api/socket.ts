import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

const rooms = new Map<string, Set<string>>();

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId)!.add(socket.id);
        
        const userCount = rooms.get(roomId)!.size;
        
        // Send to everyone in the room including the sender
        io.to(roomId).emit('user-count', userCount);
        io.to(roomId).emit('user-joined', socket.id);
        
        console.log(`User ${socket.id} joined room ${roomId}. Users: ${userCount}`);
      });

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
        
        if (rooms.has(roomId)) {
          rooms.get(roomId)!.delete(socket.id);
          const userCount = rooms.get(roomId)!.size;
          
          // Send to everyone in the room
          io.to(roomId).emit('user-count', userCount);
          io.to(roomId).emit('user-left', socket.id);
          
          if (userCount === 0) {
            rooms.delete(roomId);
          }
          
          console.log(`User ${socket.id} left room ${roomId}. Users: ${userCount}`);
        }
      });

      socket.on('ping', (data) => {
        console.log('Received ping from client:', data);
        socket.emit('pong', 'Pong from server!');
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        for (const [roomId, users] of rooms.entries()) {
          if (users.has(socket.id)) {
            users.delete(socket.id);
            const userCount = users.size;
            
            io.to(roomId).emit('user-count', userCount);
            io.to(roomId).emit('user-left', socket.id);
            
            if (userCount === 0) {
              rooms.delete(roomId);
            }
            
            console.log(`User ${socket.id} left room ${roomId}. Users: ${userCount}`);
            break;
          }
        }
      });
    });

    console.log('Socket server started on path: /api/socket');
  }
  res.end();
};

export default SocketHandler;
