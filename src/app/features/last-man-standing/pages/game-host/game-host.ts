import { Component, inject, signal } from '@angular/core';
import { FileUpload } from '../../../../shared/components/file-upload/file-upload';
import { PlayerList } from '../../../../shared/components/player-list/player-list';
import { Router } from '@angular/router';
import { PlayerService } from '../../../../core/player';
import { LmsData } from '../../../../../../shared-types';
import { SocketService } from '../../../../core/socket';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({
  selector: 'app-game-host',
  standalone: true,
  imports: [FileUpload, PlayerList],
  templateUrl: './game-host.html',
  styleUrl: './game-host.css',
})
export class GameHost {
  private router = inject(Router);
  private playerService = inject(PlayerService);
  private socket = inject(SocketService);

  code = window.location.pathname.split('/').pop();
  playerList = this.playerService.players;
  room = this.socket.room;
  justRevealed = signal<number | null>(null);
  wrongAnswers = signal<boolean[]>([]);

  get gameState() {
    return this.room()?.gameState ?? null;
  }
  get players() {
    return this.room()?.players;
  }
  get round() {
    return this.room()?.round;
  }

  nextRound() {
    this.wrongAnswers.set(this.wrongAnswers().map((w) => false));
    this.justRevealed.set(null);
    this.socket.nextRound();
  }

  reveal(index: number) {
    this.socket.revealAnswer(index);
    this.justRevealed.set(index);
  }

  revealAll() {
    const revealed = this.gameState?.revealedAnswers ?? [];
    this.wrongAnswers.set(revealed.map((r) => !r));
    revealed.forEach((r, i) => {
      if (!r) this.socket.revealAnswer(i);
    });
  }

  endGame() {
    this.socket.endGame();
  }

  showResults() {
    this.router.navigateByUrl('/results');
  }

  start(categories: LmsData[]) {
    this.socket.startGame(categories);
  }
}
