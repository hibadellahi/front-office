// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header *ngIf="authService.isLoggedIn()">
      <span>Bonjour {{ (authService.currentUser$ | async)?.username }}</span>
      <button (click)="authService.logout()">Déconnexion</button>
    </header>
  `,
  styles: [`header { padding: 1rem; background: #333; color: white; display: flex; justify-content: space-between; }`]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}