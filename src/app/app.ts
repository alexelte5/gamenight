import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SocketService } from './core/socket';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Gamenight');
  private socket = inject(SocketService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      const room = this.socket.room();
      if (room && room.state === 'results') {
        this.router.navigateByUrl(`/results/${room.code}`);
      }
    });
  }
}
