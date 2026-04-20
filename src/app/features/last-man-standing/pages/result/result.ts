import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../../core/socket';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {
  private socket = inject(SocketService);
  router = inject(Router);

  playerList = this.socket.room()?.players;

  get sorted() {
    if (this.playerList) return [...this.playerList].sort((a, b) => b.points - a.points);
    return [];
  }

  endGame() {
    this.socket.endGame();
    this.router.navigateByUrl('/');
  }
}
