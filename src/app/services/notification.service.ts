import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, delay } from 'rxjs/operators';

export interface NotificationDto {
  id?: number;
  userId: number;
  date?: string; // ISO string
  message: string;
  lu?: boolean;
  type?: string;
  // front-only helper flag to mark mock data
  isMock?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // backend écoute sur le port 8081
  private apiUrl = 'http://localhost:8081/api/notifications';

  // si true, le service retournera des données mock quand le backend renvoie vide / erreur
  public useMockWhenEmpty = true;

  constructor(private http: HttpClient) {}

  private getMockNotifications(userId: number): Observable<NotificationDto[]> {
    const now = new Date();
    const mocks: NotificationDto[] = [
      { id: 1001, userId, date: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), message: 'Votre rendez‑vous a été confirmé pour le 15 Janvier.', lu: false, isMock: true },
      { id: 1002, userId, date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), message: 'Nouveau cabinet disponible près de chez vous : Clinique El Fath.', lu: false, isMock: true }
    ];
    return of(mocks).pipe(delay(180));
  }

  getUnread(userId: number): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/${userId}/unread`).pipe(
      map(list => list || []),
      switchMap(list => {
        if (list.length > 0) return of(list);
        return this.useMockWhenEmpty ? this.getMockNotifications(userId) : of([]);
      }),
      catchError(() => this.useMockWhenEmpty ? this.getMockNotifications(userId) : of([]))
    );
  }

  getAll(userId: number): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/${userId}`).pipe(
      map(list => list || []),
      switchMap(list => {
        if (list.length > 0) return of(list);
        return this.useMockWhenEmpty ? this.getMockNotifications(userId) : of([]);
      }),
      catchError(() => this.useMockWhenEmpty ? this.getMockNotifications(userId) : of([]))
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(list: NotificationDto[]): Observable<void[]> {
    // effectue un PATCH pour chaque notification
    return new Observable(observer => {
      const calls = list.map(n => this.markAsRead(n.id as number).toPromise());
      Promise.all(calls).then(() => {
        observer.next([]);
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  create(dto: NotificationDto) {
    return this.http.post<NotificationDto>(`${this.apiUrl}/add`, dto);
  }
}
