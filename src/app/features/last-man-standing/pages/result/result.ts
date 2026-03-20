import { Component, inject, OnInit } from '@angular/core';
import { PlayerService } from '../../../../core/player';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {
  private playerService = inject(PlayerService);
  public router = inject(Router);

  playerList = this.playerService.players();

  get sorted() {
    return [...this.playerList].sort((a, b) => b.points - a.points);
  }
}
