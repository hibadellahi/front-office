import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medecin-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medecin-landing.html',
  styleUrls: ['./medecin-landing.css']
})
export class MedecinLanding {
  @ViewChild('packagesSection') packagesSection!: ElementRef;

  scrollToPackages() {
    this.packagesSection.nativeElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}
