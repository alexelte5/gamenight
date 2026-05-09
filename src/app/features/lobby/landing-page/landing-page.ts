import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../core/socket';
import { Room } from '../../../../../shared-types';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-landing-page',
  imports: [FormField],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private router = inject(Router);
  private socket = inject(SocketService);

  userModel = signal({ code: '', name: '' });
  userForm = form(this.userModel, (schema) => {
    required(schema.code);
    required(schema.name);
    minLength(schema.code, 4);
    maxLength(schema.code, 4);
  });

  constructor() {
    effect(() => {
      const room = this.socket.room();
      if (room) {
        this.router.navigateByUrl('/' + room.gameType + '/' + room.code);
      }
    });
  }

  createRoom(game: Room['gameType']) {
    this.socket.createRoom(game);
  }

  joinRoom(code: string, name: string) {
    if (this.userForm().valid()) {
      this.socket.joinRoom(code, name);
    }
  }
}
