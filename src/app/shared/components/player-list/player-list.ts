import { Component, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Player } from '../../models/player';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../../../core/player';
import { SocketService } from '../../../core/socket';

@Component({
  selector: 'app-player-list',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './player-list.html',
  styleUrl: './player-list.css',
})
export class PlayerList {
  private socket = inject(SocketService);
  private playerService = inject(PlayerService);

  @ViewChild('dialogAdd') dialogAdd!: ElementRef<HTMLDialogElement>;
  round = input<number>(0);
  players = input<Player[]>([]);

  name = new FormControl('', [Validators.required]);
  maxHealth = 3;

  reduceHealth(player: Player) {
    this.socket.reduceHealth(player.id);
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
