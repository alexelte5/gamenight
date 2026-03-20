import { Component, inject, signal } from '@angular/core';
import { FileUpload } from '../../../../shared/components/file-upload/file-upload';
import { LmsData } from '../../../../shared/models/lms-data';
import { PlayerList } from '../../../../shared/components/player-list/player-list';
import { Router } from '@angular/router';
import { PlayerService } from '../../../../core/player';

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

  categories: LmsData[] = [];
  category = signal('Lobby');
  round = signal(0);
  answers = signal<string[]>([]);
  revealed = signal<boolean[]>([]);
  justRevealed = signal<number | null>(null);
  wrong = signal<boolean[]>([]);
  playerList = this.playerService.players;

  nextRound() {
    this.category.set(this.categories[this.round()].name);
    this.answers.set(this.categories[this.round()].answers);
    this.revealed.set(this.categories[this.round()].answers.map(() => false));
    this.wrong.set(this.categories[this.round()].answers.map(() => false));
    this.justRevealed.set(null);
    this.round.set(this.round() + 1);
  }

  reveal(index: number) {
    const updated = [...this.revealed()];
    updated[index] = true;
    this.revealed.set(updated);
    this.justRevealed.set(index);
  }

  revealAll() {
    this.wrong.set(this.revealed().map((r) => !r));
  }

  cancel() {
    this.categories = [];
    this.round.set(0);
    this.category.set('Lade eine Datei hoch');
  }

  showResults() {
    this.router.navigateByUrl('/results');
  }

  start() {
    this.category.set(this.categories[this.round()].name);
    this.answers.set(this.categories[this.round()].answers);
    this.revealed.set(this.categories[this.round()].answers.map(() => false));
    this.wrong.set(this.categories[this.round()].answers.map(() => false));
    this.round.set(1);
  }
}
