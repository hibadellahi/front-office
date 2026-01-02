import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { AppointmentService } from '../../../services/appointment';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-rdv-list',
  standalone:true,
  imports: [ DatePipe, TitleCasePipe, CommonModule, FormsModule],
  templateUrl: './rdv-list.html',
  styleUrl: './rdv-list.css',
})
export class RdvListComponent implements OnInit {
  allAppointments: any[] = [];
  filteredAppointments: any[] = [];
  patients: any[] = [];
  filteredPatients: any[] = [];
  filterDate: string = '';
  loading = true;
  showAddForm = false;
  conflictError = false;

  newAppointment: any = {
    patientId: '',
    dateRdv: '',
    heureRdv: '',
    motif: '',
    statut: 'CONFIRME',
    cabinetId: 1
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadAllAppointments();
    this.loadPatients();
    this.filteredPatients = [...this.patients];
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(data => {
      this.patients = data;
    });
  }

  loadAllAppointments() {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe(data => {
      // Enrichir avec les noms des patients
      data.forEach((rdv: any) => {
        this.appointmentService.getDossierPatient(rdv.patientId).subscribe(dossier => {
          rdv.patient = dossier.patient;
        });
      });

      this.allAppointments = data;
      this.filteredAppointments = data;
      this.loading = false;
    });
  }

  applyFilter() {
    if (this.filterDate) {
      this.filteredAppointments = this.allAppointments.filter(
        rdv => rdv.dateRdv === this.filterDate
      );
    } else {
      this.filteredAppointments = this.allAppointments;
    }
  }

  clearFilter() {
    this.filterDate = '';
    this.applyFilter();
  }
  filterPatients(searchTerm: string) {
  if (!searchTerm) {
    this.filteredPatients = [...this.patients];
    return;
  }
  
  const term = searchTerm.toLowerCase();
  this.filteredPatients = this.patients.filter(patient => 
    patient.nom.toLowerCase().includes(term) ||
    patient.prenom.toLowerCase().includes(term) ||
    patient.cin.toLowerCase().includes(term)
  );
}


  createAppointment() {
  this.appointmentService.createAppointment(this.newAppointment).subscribe({
    next: () => {
      alert('Rendez-vous créé avec succès !');
      this.showAddForm = false;
      this.loadAllAppointments();
    },
    error: (err) => {
      if (err.error && err.error.message) {
        alert(err.error.message); // Affiche "Un rendez-vous existe déjà..."
      } else {
        alert('Erreur lors de la création du rendez-vous');
      }
    }
  });
}
}