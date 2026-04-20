import { Component, inject } from '@angular/core';
import { PlayerList } from '../../../../../shared/components/player-list/player-list';
import { SocketService } from '../../../../../core/socket';

@Component({
  selector: 'app-mobile',
  imports: [PlayerList],
  templateUrl: './mobile.html',
  styleUrl: './mobile.css',
})
export class Mobile {
  private socket = inject(SocketService);

  room = this.socket.room;
  code = window.location.pathname.split('/').pop();

  get gameState() {
    return this.room()?.gameState ?? null;
  }
  get round() {
    return this.room()?.round ?? 0;
  }
  get players() {
    return this.room()?.players;
  }
}
