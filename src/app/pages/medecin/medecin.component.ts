import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-medecin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medecin.component.html',
  styleUrls: ['./medecin.component.css']
})
export class MedecinComponent implements OnInit {
  currentAppointment: any = null; // Le RDV en cours
  currentDossier: any = null;
  loading = true;
  showConsultForm = false;

  newConsultation: any = {
    type: 'Consultation',
    dateConsultation: new Date().toISOString().split('T')[0],
    examenClinique: '',
    examenSupplementaire: '',
    diagnostic: '',
    traitement: '',
    observations: '',
    patientId: 0,
    cabinetId: 1
  };
  showMedicalRecordForm = false;
newMedicalRecord: any = {
  patientId: 0,
  antMedicaux: '',
  antChirug: '',
  allergies: '',
  traitement: '',
  habitudes: '',
  documentsMedicaux: ''
};

openMedicalRecordForm() {
  this.newMedicalRecord = {
    patientId: this.currentAppointment.patientId,
    antMedicaux: '',
    antChirug: '',
    allergies: '',
    traitement: '',
    habitudes: '',
    documentsMedicaux: ''
  };
  this.showMedicalRecordForm = true;
}

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadCurrentPatient();
  }

  loadCurrentPatient() {
    this.loading = true;
    const today = new Date().toISOString().split('T')[0];

    this.appointmentService.getAllAppointments().subscribe(appointments => {
      const current = appointments.find(rdv => 
        rdv.dateRdv === today && rdv.statut === 'EN_COURS'
      );

      if (current) {
        this.currentAppointment = current;
        this.newConsultation.patientId = current.patientId;

        this.appointmentService.getDossierPatient(current.patientId).subscribe(dossier => {
          this.currentDossier = dossier;
          this.loading = false;
        });
      } else {
        this.currentDossier = null;
        this.loading = false;
      }
    });
  }

  saveMedicalRecord() {
  this.appointmentService.saveMedicalRecord(this.newMedicalRecord).subscribe({
    next: () => {
      alert('Dossier médical enregistré avec succès !');
      this.showMedicalRecordForm = false;

      // ← CORRECTION ESSENTIELLE : Recharger le dossier COMPLET depuis le backend
      this.appointmentService.getDossierPatient(this.currentAppointment.patientId).subscribe(dossier => {
        this.currentDossier = dossier;
        // Maintenant hasMedicalRecord = true → le message d'alerte disparaît !
      });
    },
    error: (err) => {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du dossier médical');
    }
  });
}
  saveConsultation() {
  this.newConsultation.patientId = this.currentAppointment.patientId;
  this.appointmentService.createConsultation(this.newConsultation).subscribe({
    next: () => {
      alert('Consultation enregistrée avec succès !');
      this.showConsultForm = false;
      this.appointmentService.getDossierPatient(this.currentAppointment.patientId).subscribe(dossier => {
        this.currentDossier = dossier;
      });
      this.newConsultation = {
        type: 'Consultation',
        dateConsultation: new Date().toISOString().split('T')[0],
        examenClinique: '',
        examenSupplementaire: '',
        diagnostic: '',
        traitement: '',
        observations: '',
        patientId: this.currentAppointment.patientId
      };
    },
    error: (err) => {
      console.error('Erreur création consultation', err);
      alert('Erreur lors de l\'enregistrement de la consultation');
    }
  });
}

  terminerRdv() {
    if (confirm('Terminer ce rendez-vous ?')) {
      this.appointmentService.updateStatus(this.currentAppointment.id, 'TERMINE').subscribe(() => {
        alert('Rendez-vous terminé');
        this.loadCurrentPatient();
      });
    }
  }
}