import { Component, OnInit } from '@angular/core';
import { PatientListComponent } from './patient-list/patient-list';
import { RdvListComponent } from './rdv-list/rdv-list';
import { WaitingQueueComponent } from './waiting-queue/waiting-queue';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-secretaire',
  standalone: true,
  imports: [
    CommonModule,
    PatientListComponent,
    RdvListComponent,
    WaitingQueueComponent
  ],
  templateUrl: './secretaire.component.html',
  styleUrls: ['./secretaire.component.css']

})
export class SecretaireComponent implements OnInit{
   activeTab: 'patients' | 'rdv' | 'queue' = 'patients';
  currentTime: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000); // Mise à jour chaque minute
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  logout() {
    this.authService.logout();
  }
}