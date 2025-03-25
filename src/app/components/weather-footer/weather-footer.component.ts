import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonFooter, IonToolbar, IonSegment, 
  IonSegmentButton, IonLabel 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-weather-footer',
  templateUrl: './weather-footer.component.html',
  styleUrls: ['./weather-footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonFooter, IonToolbar, 
    IonSegment, IonSegmentButton,
    IonLabel
  ]
})
export class WeatherFooterComponent {
  @Output() weatherChange = new EventEmitter<'soleado' | 'nublado' | 'lluvia' | 'nevado'>();
  currentWeather: 'soleado' | 'nublado' | 'lluvia' | 'nevado' = 'soleado';

  onWeatherChange(event: any) {
    this.currentWeather = event.detail.value;
    this.weatherChange.emit(this.currentWeather);
  }
}