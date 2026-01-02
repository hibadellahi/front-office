import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  // Patients
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  getPatient(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/${id}`);
  }

  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patients`, patient);
  }

  updatePatient(id: number, patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/patients/${id}`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patients/${id}`);
  }

  // Rendez-vous
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }

  getAppointmentsToday(): Observable<any[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get<any[]>(`${this.apiUrl}/appointments?date=${today}`);
  }

  // File d'attente (statut EN_ATTENTE)
  getWaitingQueue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments?statut=EN_ATTENTE`);
  }

  updateAppointmentStatus(id: number, statut: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/appointments/${id}/status`, { statut });
  }
}