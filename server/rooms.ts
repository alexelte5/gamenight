import { Server, Socket } from 'socket.io';
import type {
  Room,
  Player,
  LmsGameState,
  LmsData,
  ClientEvents,
  ServerEvents,
} from '../shared-types';

const rooms = new Map<string, Room>();
const disconnectTimers = new Map<string, ReturnType<typeof setTimeout>>();

function generateCode(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function registerRoomHandlers(
  io: Server<ClientEvents, ServerEvents>,
  socket: Socket<ClientEvents, ServerEvents>,
) {
  socket.on('room:create', (gameType) => {
    const code = generateCode();
    const room: Room = {
      code,
      gameType,
      gameState: null,
      state: 'lobby',
      round: 0,
      hostId: socket.id,
      players: [],
    };
    rooms.set(code, room);
    socket.join(code);
    socket.emit('room:created', room);
    console.log('room created: ', room);
  });

  socket.on('room:join', ({ code, name }) => {
    const room = rooms.get(code);
    const token = crypto.randomUUID();
    if (!room) return socket.emit('error', 'Room nicht gefunden');
    const player: Player = {
      id: socket.id,
      name,
      token: token,
      health: 3,
      points: 0,
      isHost: false,
      connected: true,
    };
    room.players.push(player);
    socket.join(code);
    socket.emit('room:joined', { room, token });
    socket.to(code).emit('room:updated', room);
  });

  socket.on('room:reconnect', (token) => {
    const room = [...rooms.values()].find((r) => r.players.some((p) => p.token === token));
    if (!room) return socket.emit('error', 'Token ungültig');

    const timer = disconnectTimers.get(token);
    if (timer) {
      clearTimeout(timer);
      disconnectTimers.delete(token);
    }

    room.players = room.players.map((p) =>
      p.token === token ? { ...p, id: socket.id, connected: true } : p,
    );

    socket.join(room.code);
    socket.emit('room:joined', { room, token });
    socket.to(room.code).emit('room:updated', room);
  });

  socket.on('game:start', (payload) => {
    const room = getRoomByHost(socket.id);
    if (!room) return;
    room.state = 'playing';
    room.round = 1;
    room.gameState = {
      categories: payload.categories,
      currentCategory: 0,
      revealedAnswers: payload.categories[0].answers.map(() => false),
    };
    io.to(room.code).emit('game:stateChanged', room);
  });

  socket.on('game:nextRound', () => {
    const room = getRoomByHost(socket.id);
    if (!room || !room.gameState) return;

    const next = room.gameState.currentCategory + 1;
    room.gameState = {
      ...room.gameState,
      currentCategory: next,
      revealedAnswers: room.gameState.categories[next].answers.map(() => false),
    };
    room.round += 1;
    io.to(room.code).emit('game:stateChanged', room);
  });

  socket.on('game:revealAnswer', (index) => {
    const room = getRoomByHost(socket.id);
    if (!room || !room.gameState) return;
    room.gameState.revealedAnswers[index] = true;
    io.to(room.code).emit('game:stateChanged', room);
  });

  socket.on('game:reduceHealth', (playerId) => {
    const room = getRoomByHost(socket.id);
    if (!room) return;
    room.players = room.players.map((p) =>
      p.id === playerId ? { ...p, health: Math.max(0, p.health - 1) } : p,
    );
    io.to(room.code).emit('game:stateChanged', room);
  });

  socket.on('game:select', (gameType) => {
    const room = getRoomByHost(socket.id);
    if (!room) return;
    room.gameType = gameType;
    room.state = 'lobby';
    room.round = 0;
    io.to(room.code).emit('game:stateChanged', room);
  });

  socket.on('game:end', () => {
    const room = getRoomByHost(socket.id);
    if (!room) return;
    room.state = 'results';
    room.gameState = null;
    io.to(room.code).emit('game:stateChanged', room);
  });

  socket.on('disconnect', () => {
    const room = [...rooms.values()].find((r) => r.players.some((p) => p.id === socket.id));
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    room.players = room.players.map((p) => (p.id === socket.id ? { ...p, connected: false } : p));
    io.to(room.code).emit('room:updated', room);

    const timer = setTimeout(() => {
      room.players = room.players.filter((p) => p.id !== socket.id);
      io.to(room.code).emit('room:updated', room);
      disconnectTimers.delete(player.token);
    }, 5000);

    disconnectTimers.set(player.token, timer);
  });
}

function getRoomByHost(hostId: string): Room | undefined {
  return [...rooms.values()].find((r) => r.hostId === hostId);
}
