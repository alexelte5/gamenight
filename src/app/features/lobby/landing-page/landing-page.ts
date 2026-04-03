import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../core/socket';
import { Room } from '../../../../../shared-types';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private router = inject(Router);
  private socket = inject(SocketService);

  constructor() {
    effect(() => {
      const room = this.socket.room();
      if (room) {
        this.router.navigateByUrl('/' + room.gameType + '/' + room.code);
      }
    });
  }

  createRoom(game: Room['gameType']) {
    this.socket.createRoom(game);
  }
}
