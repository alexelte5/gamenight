import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import type { Room, ClientEvents, ServerEvents, LmsData } from '../../../shared-types';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket<ServerEvents, ClientEvents> = io('http://localhost:3000');

  socketId = signal<string | null>(null);
  room = signal<Room | null>(null);
  token = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor() {
    const token = localStorage.getItem('gamenight-token');
    if (token) this.socket.emit('room:reconnect', token);

    this.socket.on('connect', () => {
      this.socketId.set(this.socket.id ?? null);
    });
    this.socket.on('room:created', (r) => this.room.set(r));
    this.socket.on('room:updated', (r) => this.room.set(r));
    this.socket.on('game:stateChanged', (r) => this.room.set(r));
    this.socket.on('room:joined', ({ room, token }) => {
      this.room.set(room);
      this.token.set(token);
      localStorage.setItem('gamenight-token', token);
    });
    this.socket.on('error', (msg) => this.error.set(msg));
  }

  isHost() {
    return this.room()?.hostId === this.socketId();
  }

  createRoom(gameType: Room['gameType']) {
    this.socket.emit('room:create', gameType);
  }

  joinRoom(code: string, name: string) {
    this.socket.emit('room:join', { code, name });
  }

  addPlayer(name: string) {
    this.socket.emit('room:addPlayer', name);
  }

  removePlayer(playerId: string) {
    this.socket.emit('room:removePlayer', playerId);
  }

  startGame(categories: LmsData[]) {
    this.socket.emit('game:start', { categories });
  }

  nextRound() {
    this.socket.emit('game:nextRound');
  }

  revealAnswer(index: number) {
    this.socket.emit('game:revealAnswer', index);
  }

  revealAll(wrongs: boolean[]) {
    this.socket.emit('game:revealAll', wrongs);
  }

  reduceHealth(playerId: string) {
    this.socket.emit('game:reduceHealth', playerId);
  }

  selectGame(gameType: Room['gameType']) {
    this.socket.emit('game:select', gameType);
  }

  results() {
    this.socket.emit('game:results');
  }

  endGame() {
    this.socket.emit('game:end');
  }
}
