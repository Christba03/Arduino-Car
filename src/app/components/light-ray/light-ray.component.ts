import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-light-ray',
  templateUrl: './light-ray.component.html',
  styleUrls: ['./light-ray.component.scss'],
  standalone: true
})
export class LightRayComponent {
  @Input() angle: number = 135; // Default diagonal angle
  @Input() duration: number = 3; // Animation duration in seconds
  @Input() intensity: number = 0.7; // Light intensity (0-1)
}