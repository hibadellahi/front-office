// src/app/components/stats-display/stats-display.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Region {
  name: string;
  percentage: number;
}

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-display.html',
  styleUrls: ['./stats-display.css']
})
export class StatsDisplayComponent implements OnInit {
  stats = {
    cabinets: 500,
    patients: 50000,
    regionsCovered: 10,
    successRate: 98
  };

  regions: Region[] = [
    { name: 'Casablanca-Settat', percentage: 95 },
    { name: 'Rabat-Salé-Kénitra', percentage: 90 },
    { name: 'Marrakech-Safi', percentage: 85 },
    { name: 'Fès-Meknès', percentage: 80 },
    { name: 'Tanger-Tétouan-Al Hoceïma', percentage: 75 },
    { name: "Souss-Massa", percentage: 70 }
  ];

  ngOnInit() {
    // Simuler un chargement dynamique
    setTimeout(() => {
      this.stats = {
        cabinets: 523,
        patients: 52367,
        regionsCovered: 12,
        successRate: 98.5
      };
    }, 1000);
  }
}