import { Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Player } from '../../models/player';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from '../../../core/socket';

@Component({
  selector: 'app-player-list',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './player-list.html',
  styleUrl: './player-list.css',
})
export class PlayerList {
  private socket = inject(SocketService);

  @ViewChild('dialogAdd') dialogAdd!: ElementRef<HTMLDialogElement>;
  isHost = input<boolean>(false);
  isMobile = input<boolean>(false);

  name = new FormControl('', [Validators.required]);

  get round() {
    return this.socket.room()?.round ?? 0;
  }

  get players() {
    return this.socket.room()?.players ?? [];
  }

  get maxHealth() {
    return this.socket.room()!.settings.maxHealth;
  }

  reduceHealth(player: Player) {
    if (this.isHost()) this.socket.reduceHealth(player.id);
  }

  deletePlayer(player: Player) {
    if (this.isHost()) this.socket.removePlayer(player.id);
  }

  addPlayer() {
    if (this.name.value !== null) {
      if (this.name.value.trim() !== '') {
        this.socket.addPlayer(this.name.value);
        this.name.setValue('');
        this.closeAdd();
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
