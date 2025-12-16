import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatsDisplayComponent } from '../../components/stats-display/stats-display';

@Component({
  selector: 'app-inscription-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatsDisplayComponent],
  templateUrl: './inscription-page.html',
  styleUrls: ['./inscription-page.css']
})
export class InscriptionPage {

}
