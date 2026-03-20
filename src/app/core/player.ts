import { Injectable, signal, computed } from '@angular/core';
import { Player } from '../shared/models/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerList = signal<Player[]>([]);
  readonly players = this.playerList.asReadonly();
  readonly eliminatedCount = computed(() => this.playerList().filter((p) => p.health === 0).length);

  addPlayer(name: string, maxHealth: number) {
    if (name) {
      const newPlayer: Player = {
        name: name,
        health: maxHealth,
        points: 0,
      };
      this.playerList.update((list) => [...list, newPlayer]);
    }
  }

  removePlayer(player: Player) {
    this.playerList.update((list) => list.filter((p) => p.name !== player.name));
  }

  reduceHealth(player: Player) {
    this.playerList.update((list) => {
      return list.map((p) => {
        if (p.name === player.name && p.health > 0) {
          const updatedPlayer = { ...p, health: p.health - 1 };
          if (updatedPlayer.health === 0) {
            const alreadyEliminated = list.filter((other) => other.health === 0).length;
            updatedPlayer.points += alreadyEliminated + 1;
          }
          return updatedPlayer;
        }
        return p;
      });
    });
  }

  newRound(maxHealth: number) {
    this.playerList.update((list) => {
      const eliminatedCount = list.filter((p) => p.health === 0).length;

      return list.map((p) => ({
        ...p,
        points: p.health > 0 ? p.points + eliminatedCount + 1 : p.points,
        health: maxHealth,
      }));
    });
  }

  resetAll(maxHealth: number) {
    this.playerList.update((list) => list.map((p) => ({ ...p, health: maxHealth, points: 0 })));
  }
}
