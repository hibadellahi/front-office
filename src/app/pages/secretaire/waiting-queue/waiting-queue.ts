import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../services/appointment';

@Component({
  selector: 'app-waiting-queue',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './waiting-queue.html',
  styleUrl: './waiting-queue.css',
})
export class WaitingQueueComponent implements OnInit {
  waitingQueue: any[] = [];
  today: string = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  loading = true;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadTodayQueue();
    // Rafraîchissement automatique toutes les 10 secondes
    interval(10000).subscribe(() => this.loadTodayQueue());
  }

  loadTodayQueue() {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        const todayQueue = data
          .filter((rdv: any) => rdv.dateRdv === this.today && rdv.statut === 'CONFIRME')
          .sort((a: any, b: any) => a.heureRdv.localeCompare(b.heureRdv));

        // Charger le nom du patient pour chaque RDV
        todayQueue.forEach(rdv => {
          this.appointmentService.getDossierPatient(rdv.patientId).subscribe(dossier => {
            rdv.patient = dossier.patient; // Ajoute nom, prénom, cin...
          });
        });

        this.waitingQueue = todayQueue;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  callNext(appointmentId: number) {
    this.appointmentService.updateStatus(appointmentId, 'EN_COURS').subscribe({
      next: () => {
        this.loadTodayQueue(); // Rafraîchit immédiatement
      },
      error: (err) => {
        console.error('Erreur appel patient', err);
        alert('Erreur lors de l\'appel du patient');
      }
    });
  }
}