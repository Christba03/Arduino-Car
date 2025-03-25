import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Building {
  height: string;
  width: string;
  color: string;
}

@Component({
  selector: 'app-building-background',
  templateUrl: './building-background.component.html',
  styleUrls: ['./building-background.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BuildingBackgroundComponent implements OnInit {
  buildings: Building[] = [];
  private readonly BUILDING_COUNT = 15;
  private readonly COLORS = [
    '#1B263B', // Deep Navy Blue  
    '#415A77', // Steel Blue  
    '#778DA9', // Light Desaturated Blue  
    '#E0E1DD', // Soft Grayish White  
    '#A4161A', // Deep Red  
  ];

  ngOnInit(): void {
    this.buildings = Array(this.BUILDING_COUNT).fill(0).map(() => ({
      height: `${30 + Math.random() * 50}%`,
      width: `${80 + Math.random() * 80}px`,
      color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)]
    }));
  }

  trackByFn(index: number): number {
    return index;
  }
}