import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }

  updateStatus(id: number, statut: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/appointments/${id}`, { statut });
}

createAppointment(appointment: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/appointments`, appointment);
}
getPatientById(patientId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/dossiers/${patientId}`);
}
getDossierPatient(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dossiers/${patientId}`);
  }
saveMedicalRecord(record: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/dossiers/save-record`, record);
}
createConsultation(consultation: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/consultations`, consultation);
}
}
