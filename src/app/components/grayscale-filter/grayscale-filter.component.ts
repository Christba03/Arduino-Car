// grayscale-filter.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grayscale-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grayscale-filter" [class.active]="isActive"></div>
  `,
  styles: [`
    .grayscale-filter {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      transition: filter 0.5s ease;
    }
    .active {
      filter: grayscale(100%);
      background-color: rgba(0, 0, 0, 0.4);
    }
  `]
})
export class GrayscaleFilterComponent {
  @Input() isActive = false;
}