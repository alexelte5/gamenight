import { Component, inject } from '@angular/core';
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
  private socket = inject(SocketService);
  isHost = this.socket.isHost();
}
