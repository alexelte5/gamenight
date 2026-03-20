import { Component, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Player } from '../../models/player';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../../../core/player';

@Component({
  selector: 'app-player-list',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './player-list.html',
  styleUrl: './player-list.css',
})
export class PlayerList {
  private playerService = inject(PlayerService);

  @ViewChild('dialogAdd') dialogAdd!: ElementRef<HTMLDialogElement>;
  round = input<number>(0);

  constructor() {
    effect(() => {
      if (this.round() == 1) {
        this.resetPlayer();
      } else if (this.round() > 1) {
        this.newRound();
      }
    });
  }

  name = new FormControl('', [Validators.required]);

  maxHealth: number = 1;
  playerList = this.playerService.players;

  reduceHealth(player: Player) {
    this.playerService.reduceHealth(player);
  }

  resetPlayer() {
    this.playerService.resetAll(this.maxHealth);
  }

  newRound() {
    this.playerService.newRound(this.maxHealth);
  }

  deletePlayer(player: Player) {
    this.playerService.removePlayer(player);
  }

  save() {
    if (this.name.value !== null) {
      if (this.name.value.trim() !== '') {
        this.playerService.addPlayer(this.name.value, this.maxHealth);
        this.closeAdd();
        this.name.setValue('');
      }
    }
  }

  openAdd() {
    this.dialogAdd.nativeElement.showModal();
  }

  closeAdd() {
    this.dialogAdd.nativeElement.close();
  }
}
