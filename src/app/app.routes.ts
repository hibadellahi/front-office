import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MedecinComponent } from './pages/medecin/medecin.component';
import { SecretaireComponent } from './pages/secretaire/secretaire.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { LandingPage } from './pages/landing-page/landing-page';
import { PatientPage } from './pages/patient-page/patient-page';
import { InscriptionPage } from './pages/inscription-page/inscription-page';
import { MedecinLanding } from './pages/medecin-landing/medecin-landing';
import { PatientListComponent } from './pages/secretaire/patient-list/patient-list';
import { RdvListComponent } from './pages/secretaire/rdv-list/rdv-list';
import { WaitingQueueComponent } from './pages/secretaire/waiting-queue/waiting-queue';
;

export const routes: Routes = [
  { path: '', component: LandingPage }, 
  { path: 'login', component: LoginComponent },
  { path: 'patient', component: PatientPage },
  { path: 'inscription', component: InscriptionPage },
  { path: 'medecin-landing', component: MedecinLanding },
  { path: 'medecin', component: MedecinComponent },
  { path: 'admin', component: AdminComponent, canMatch: [authGuard] },
  {
  path: 'secretaire',
  component: SecretaireComponent,
  canMatch: [authGuard],
  children: [
    { path: 'patients', component: PatientListComponent },
    { path: 'rdv', component: RdvListComponent },
    { path: 'queue', component: WaitingQueueComponent },
    { path: '', redirectTo: 'patients', pathMatch: 'full' }
  ]
  }  
];