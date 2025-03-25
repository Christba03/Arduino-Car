import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type WeatherType = 'soleado' | 'nublado' | 'lluvia' | 'nevado';

@Component({
  selector: 'app-weather-background',
  templateUrl: './weather-background.component.html',
  styleUrls: ['./weather-background.component.scss'],
  standalone: true,
  imports: [CommonModule], // Add this line
})
export class WeatherBackgroundComponent {
  @Input() weather: WeatherType = 'soleado';
  
  // Generate lots of snowflakes (adjust count as needed)
  snowflakes = Array(6).fill(0);

}