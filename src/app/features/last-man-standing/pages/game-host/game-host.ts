import { Component, inject } from '@angular/core';
import { FileUpload } from '../../../../shared/components/file-upload/file-upload';
import { PlayerList } from '../../../../shared/components/player-list/player-list';
import { Router } from '@angular/router';
import { LmsData } from '../../../../../../shared-types';
import { SocketService } from '../../../../core/socket';
import { Cards } from '../../components/cards/cards';
import { Settings } from "../../../../shared/components/settings/settings";

@Component({
  selector: 'app-game-host',
  standalone: true,
  imports: [FileUpload, PlayerList, Cards, Settings],
  templateUrl: './game-host.html',
  styleUrl: './game-host.css',
})
export class GameHost {
  private router = inject(Router);
  private socket = inject(SocketService);

  code = window.location.pathname.split('/').pop();
  room = this.socket.room;
  categories: LmsData[] = [];

  get gameState() {
    return this.room()?.gameState ?? null;
  }
  get players() {
    return this.room()?.players;
  }
  get round() {
    return this.room()?.round;
  }
  get wrongAnswers() {
    return this.room()?.gameState?.wrongAnswers;
  }

  nextRound() {
    this.socket.nextRound();
  }

  reveal(index: number) {
    this.socket.revealAnswer(index);
  }

  revealAll() {
    const revealed = this.gameState?.revealedAnswers ?? [];
    const wrongs = revealed.map((r) => !r);
    this.socket.revealAll(wrongs);
  }

  endGame() {
    this.socket.endGame();
  }

  showResults() {
    this.socket.results();
    this.router.navigateByUrl('/results');
  }

  start(categories: LmsData[]) {
    this.socket.startGame(categories);
  }
}
