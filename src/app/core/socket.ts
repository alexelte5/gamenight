import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import type { Room, ClientEvents, ServerEvents } from '../../../shared-types';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket<ServerEvents, ClientEvents> =
    io('http://localhost:3000');

  room = signal<Room | null>(null);
  error = signal<string | null>(null);

  constructor() {
    this.socket.on('room:created', r => this.room.set(r));
    this.socket.on('room:updated', r => this.room.set(r));
    this.socket.on('game:stateChanged', r => this.room.set(r));
    this.socket.on('error', msg => this.error.set(msg));
  }
}