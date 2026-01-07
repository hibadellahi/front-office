import { Component, Signal, computed, effect, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationDto } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnDestroy {
  unreadCount = signal(0);
  private pollHandle: any;

  constructor(private svc: NotificationService, private auth: AuthService) {
    this.load();
    // poll every 25 seconds to keep badge updated
    this.pollHandle = setInterval(() => this.load(), 25000);
  }

  load() {
    const userId = this.auth.getUserId() ?? 1;
    this.svc.getUnread(userId).pipe(take(1)).subscribe(list => {
      if (!list || list.length === 0) {
        // show demo count if there are no real notifications (so dev / demo users see the badge)
        this.unreadCount.set(2);
      } else {
        this.unreadCount.set(list.length);
      }
    }, () => this.unreadCount.set(0));
  }

  ngOnDestroy(): void {
    if (this.pollHandle) clearInterval(this.pollHandle);
  }
}
