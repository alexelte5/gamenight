import { Component } from '@angular/core';
import { Desktop } from './desktop/desktop';
import { Mobile } from './mobile/mobile';

@Component({
  selector: 'app-user',
  imports: [Desktop, Mobile],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  isMobile = (): boolean => {
    if (window.innerWidth < 1000) {
      return true;
    } else {
      return false;
    }
  };
}
