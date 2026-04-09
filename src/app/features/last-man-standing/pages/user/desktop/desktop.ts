import { Component, inject } from '@angular/core';
import { Cards } from '../../../components/cards/cards';
import { SocketService } from '../../../../../core/socket';
import { PlayerList } from '../../../../../shared/components/player-list/player-list';

@Component({
  selector: 'app-desktop',
  imports: [Cards, PlayerList],
  templateUrl: './desktop.html',
  styleUrl: './desktop.css',
})
export class Desktop {
  private socket = inject(SocketService);

  room = this.socket.room;
  code = window.location.pathname.split('/').pop();

  get gameState() {
    return this.room()?.gameState ?? null;
  }
  get players() {
    return this.room()?.players;
  }
  get round() {
    return this.room()?.round ?? 0;
  }
}
