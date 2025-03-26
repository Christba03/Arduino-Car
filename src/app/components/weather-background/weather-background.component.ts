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
  
  raindrops = Array(40).fill(0); 
  snowflakes = Array(12).fill(0);
  
  getRainStyle(index: number) {
    return {
      left: `${5 + (index % 18) * 5}%`, 
      animationDelay: `${Math.random() * 0.5}s`,
      animationDuration: `${0.8 + Math.random() * 0.4}s`,
      height: `${8 + Math.random() * 8}px`, 
    };
  }
}