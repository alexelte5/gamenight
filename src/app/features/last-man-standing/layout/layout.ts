import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameHost } from '../pages/game-host/game-host';
import { User } from '../pages/user/user';
import { SocketService } from '../../../core/socket';

@Component({
  selector: 'app-layout',
  imports: [GameHost, User],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private router = inject(Router);
  private socket = inject(SocketService);
  isHost = computed(() => this.socket.isHost());
  hostLeft = computed(() => this.socket.hostLeft());

  closePopup() {
    this.socket.hostLeft.set(false);
    this.router.navigate(['/']);
  }
}
