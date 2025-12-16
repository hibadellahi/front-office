// src/app/pages/medecin/medecin.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-medecin',
  standalone: true,
  imports: [HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="page">
      <h1>Espace Médecin</h1>
      <p>Bienvenue dans votre tableau de bord médecin !</p>
    </div>
  `,
  styles: [`.page { padding: 2rem; text-align: center; }`]
})
export class MedecinComponent {}