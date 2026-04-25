import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { SocketService } from '../../../core/socket';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private socket = inject(SocketService);

  @ViewChild('dialogSettings') dialogSettings!: ElementRef<HTMLDialogElement>;

  timerInput = new FormControl(this.timer);

  maxHealthInput = signal(this.maxHealth);

  get maxHealth() {
    return this.socket.room()!.settings.maxHealth;
  }

  get timer() {
    return this.socket.room()!.settings.timer;
  }

  openSettings() {
    this.dialogSettings.nativeElement.showModal();
  }

  closeSettings() {
    this.dialogSettings.nativeElement.close();
    this.maxHealthInput.set(this.maxHealth);
  }

  setMaxHealth(health: number) {
    this.maxHealthInput.set(health);
  }

  saveSettings() {
    this.socket.updateSettings(this.maxHealthInput(), this.timerInput.value);
    this.dialogSettings.nativeElement.close();
  }
}
