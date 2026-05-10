import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerRoomHandlers } from './rooms';
import type { ClientEvents, ServerEvents } from '../shared-types';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientEvents, ServerEvents>(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:4200', methods: ['GET', 'POST'] },
  transports: ['websocket'],
  allowUpgrades: false,
});
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log(`+ connected: ${socket.id}`);
  registerRoomHandlers(io, socket);
  socket.on('disconnect', (reason) => console.log(`- disconnected: ${socket.id} (Reason: ${reason})`));
});

httpServer.listen(PORT, () =>
  console.log(`🎮 Gamenight server running on :${PORT}`),
);
