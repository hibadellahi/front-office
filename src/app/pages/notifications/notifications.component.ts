import { Component, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
import { NotificationService, NotificationDto } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  userId: number;
  notifications = signal<NotificationDto[]>([]);
  showAll = signal(false);
  isLoading = signal(false);
  showMock = signal(false);

  constructor(private svc: NotificationService, private auth: AuthService) {
    this.userId = this.auth.getUserId() ?? 1; // fallback to 1 for demo
    this.loadUnread();
  }

  loadUnread() {
    this.isLoading.set(true);
    this.svc.getUnread(this.userId).subscribe(list => {
      const sorted = (list || []).sort((a,b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
      this.notifications.set(sorted);
      // détecter si la liste vient du mock
      const hasMock = sorted.some(n => (n as any).isMock === true);
      this.showMock.set(hasMock);
      this.isLoading.set(false);
    }, () => { this.notifications.set([]); this.isLoading.set(false); this.showMock.set(true); });
  }

  loadAll() {
    this.isLoading.set(true);
    this.svc.getAll(this.userId).subscribe(list => {
      this.notifications.set(list.sort((a,b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime()));
      this.isLoading.set(false);
    }, () => { this.notifications.set([]); this.isLoading.set(false); });
  }

  toggleShowAll() {
    const next = !this.showAll();
    this.showAll.set(next);
    if (next) this.loadAll(); else this.loadUnread();
  }

  markAllRead() {
    const list = this.notifications();
    if (!list.length) return;
    this.svc.markAllAsRead(list).subscribe({ next: () => this.loadUnread(), error: () => this.loadUnread() });
  }

  markRead(n: NotificationDto) {
    if (!n.id) return;
    this.svc.markAsRead(n.id).subscribe({ next: () => this.loadUnread(), error: () => this.loadUnread() });
  }

  disableMock() {
    this.svc.useMockWhenEmpty = false;
    this.loadUnread();
  }


}
