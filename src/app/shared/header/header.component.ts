// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationBellComponent } from '../../components/notification-bell/notification-bell.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent, FormsModule],
  template: `
    <nav *ngIf="authService.isLoggedIn()" class="navbar">
      <div class="nav-left">
        <a routerLink="/" class="brand">Accueil</a>
      </div>

      <div class="nav-center">
        <form (submit)="onSearch($event)" class="search-form">
          <input [(ngModel)]="searchTerm" name="q" class="search-input" placeholder="Rechercher..." />
        </form>
      </div>

      <div class="nav-right">
        <a routerLink="/notifications" title="Notifications" class="bell-link">
          <app-notification-bell></app-notification-bell>
        </a>
        <button class="logout" (click)="authService.logout()">Déconnexion</button>
      </div>
    </nav>
  `,
  styles: [`:root{ --blue-spruce: #0E7268; --tuscan-sun:#FAC967; --frozen-water:#C5DFD8 }
  .navbar{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 16px; background:var(--blue-spruce); color:#fff }
  .nav-left .brand{ color:#fff; font-weight:700; text-decoration:none }
  .nav-center{ flex:1; display:flex; justify-content:center }
  .search-form{ width:100%; max-width:560px }
  .search-input{ width:100%; padding:8px 12px; border-radius:8px; border: none; font-size:14px }
  .nav-right{ display:flex; align-items:center; gap:12px }
  .logout{ background:transparent; border:1px solid rgba(255,255,255,0.18); color:#fff; padding:6px 10px; border-radius:8px; cursor:pointer }
  .bell-link{ display:inline-flex; align-items:center }
  `]
})
export class HeaderComponent {
  searchTerm = '';
  constructor(public authService: AuthService, private router: Router) {}

  onSearch(e: Event) {
    e.preventDefault();
    const q = (this.searchTerm || '').trim();
    if (!q) return;
    // navigate to landing page with query param 'q' (adjust as needed)
    this.router.navigate(['/'], { queryParams: { q } });
    this.searchTerm = '';
  }
}