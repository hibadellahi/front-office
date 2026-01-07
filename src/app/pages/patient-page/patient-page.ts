import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { PatientChatComponent } from '../../components/patient-chat/patient-chat.component';
import { StatsDisplayComponent } from '../../components/stats-display/stats-display';

@Component({
  selector: 'app-patient-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientChatComponent, StatsDisplayComponent],
  templateUrl: './patient-page.html',
  styleUrls: ['./patient-page.css']
})
export class PatientPage {

}
