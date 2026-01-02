import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchTerm: string = '';
  showModal = false;
  isEdit = false;
  currentPatient: any = {};

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(data => {
      this.patients = data;
      this.filteredPatients = data;
    });
  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(p =>
      p.cin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddModal() {
    this.isEdit = false;
    this.currentPatient = {};
    this.showModal = true;
  }

  openEditModal(patient: any) {
    this.isEdit = true;
    this.currentPatient = { ...patient };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePatient() {
    if (this.isEdit) {
      this.patientService.updatePatient(this.currentPatient.id, this.currentPatient).subscribe(() => {
        this.loadPatients();
        this.closeModal();
      });
    } else {
      this.patientService.createPatient(this.currentPatient).subscribe(() => {
        this.loadPatients();
        this.closeModal();
      });
    }
  }

  deletePatient(id: number) {
    if (confirm('Supprimer ce patient ?')) {
      this.patientService.deletePatient(id).subscribe(() => {
        this.loadPatients();
      });
    }
  }
}
