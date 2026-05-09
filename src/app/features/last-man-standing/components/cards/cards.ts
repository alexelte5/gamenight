import { Component, inject, input, signal } from '@angular/core';
import { SocketService } from '../../../../core/socket';

@Component({
  selector: 'app-cards',
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  host: {
    '[class.is-host]': 'isHost()',
  },
})
export class Cards {
  private socket = inject(SocketService);

  isHost = input<boolean>(false);

  room = this.socket.room;

  get gameState() {
    return this.room()?.gameState ?? null;
  }

  get justRevealed() {
    return this.room()?.gameState?.justRevealed;
  }

  get wrongAnswers() {
    return this.room()?.gameState?.wrongAnswers ?? null;
  }

  reveal(index: number) {
    this.socket.revealAnswer(index);
  }
}
