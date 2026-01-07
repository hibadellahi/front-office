// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

interface JwtPayload {
  preferred_username?: string;
  realm_access?: { roles: string[] };
  resource_access?: {
    'user-auth-client'?: { roles: string[] };
  };
  exp: number;
}

interface User { username: string; roles: string[] }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8087/api/auth';
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.tokenKey, res.accessToken);
          localStorage.setItem(this.refreshTokenKey, res.refreshToken);
          this.loadToken();
          this.redirectByRole();
        })
      );
  }

  logout() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    // supprimer uniquement nos clés
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadToken() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const payload = jwtDecode<JwtPayload>(token);

      // ON LIT LES RÔLES DU CLIENT "user-auth-client" !!
      const clientRoles = payload.resource_access?.['user-auth-client']?.roles || [];
      const roles = clientRoles.map(r => 'ROLE_' + r.toUpperCase());

      // Ne pas logguer en production
      this.currentUserSubject.next({
        username: payload.preferred_username || 'Utilisateur',
        roles: roles
      });
    } else {
      this.currentUserSubject.next(null);
    }
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = jwtDecode<any>(token);
      // essayer d'extraire un id depuis les claims classiques
      const id = payload.sub || payload.userId || payload.uid;
      if (id) return Number(id);
    } catch { }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(role) || false;
  }

  redirectByRole() {
    if (this.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/admin']);
    } else if (this.hasRole('ROLE_MEDECIN')) {
      this.router.navigate(['/medecin']);
    } else if (this.hasRole('ROLE_SECRETAIRE')) {
      this.router.navigate(['/secretaire']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}