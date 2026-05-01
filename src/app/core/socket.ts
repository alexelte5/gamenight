import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import type { Room, ClientEvents, ServerEvents, LmsData } from '../../../shared-types';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket<ServerEvents, ClientEvents> = io('http://localhost:3000');
  private reconnectToken: string | null = null;

  socketId = signal<string | null>(null);
  room = signal<Room | null>(null);
  error = signal<string | null>(null);

  constructor() {
    const hostToken = localStorage.getItem('gamenight-hostToken');
    const playerToken = localStorage.getItem('gamenight-token');
    
    if (hostToken) {
      this.reconnectToken = hostToken;
      this.socket.emit('room:reconnect', hostToken);
    } else if (playerToken) {
      this.reconnectToken = playerToken;
      this.socket.emit('room:reconnect', playerToken);
    }

    this.socket.on('connect', () => {
      this.socketId.set(this.socket.id ?? null);
    });
    this.socket.on('room:created', (r) => {
      this.room.set(r);
      if (r.hostToken) localStorage.setItem('gamenight-hostToken', r.hostToken);
    });
    this.socket.on('room:updated', (r) => this.room.set(r));
    this.socket.on('game:stateChanged', (r) => this.room.set(r));
    this.socket.on('room:joined', ({ room, token }) => {
      this.room.set(room);
      // Nur speichern als playerToken, wenn es NICHT der ursprüngliche hostToken ist
      if (this.reconnectToken === token && localStorage.getItem('gamenight-hostToken') === token) {
        // Das ist ein Reconnect des Hosts - behalte hostToken
        localStorage.setItem('gamenight-hostToken', token);
      } else {
        // Das ist ein normaler Join oder wir haben keinen Host-Token
        localStorage.setItem('gamenight-token', token);
      }
      this.reconnectToken = null; // Reset nach Verarbeitung
    });
    this.socket.on('error', (msg) => this.error.set(msg));
  }

  isHost() {
    const room = this.room();
    const socketId = this.socketId();
    if (!room || !socketId) return false;
    
    // Explizit: Nur Host wenn socketId gleich hostId ist
    return room.hostId === socketId;
  }

  createRoom(gameType: Room['gameType']) {
    this.socket.emit('room:create', gameType);
  }

  updateSettings(maxHealth: number, timer: number | null) {
    this.socket.emit('room:updateSettings', { maxHealth, timer });
  }

  joinRoom(code: string, name: string) {
    this.socket.emit('room:join', { code, name });
  }

  leaveRoom() {
    this.socket.emit('room:leave');
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
