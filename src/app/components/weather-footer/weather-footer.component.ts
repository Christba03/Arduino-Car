import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonFooter, IonToolbar, IonSegment, 
  IonSegmentButton, IonLabel 
} from '@ionic/angular/standalone';
import { WeatherType } from 'src/app/service/vehicle-control.service';
import { Subscription } from 'rxjs';
import { VehicleControlService } from 'src/app/service/vehicle-control.service';

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
export class WeatherFooterComponent implements OnInit, OnDestroy {
  currentWeather: WeatherType = 'soleado';
  private weatherSubscription!: Subscription;
  
  @Output() weatherChange = new EventEmitter<WeatherType>();

  constructor(private vehicleControl: VehicleControlService) {}

  ngOnInit() {
    this.currentWeather = this.vehicleControl.getCurrentWeather();
    this.weatherSubscription = this.vehicleControl.weather$.subscribe(weather => {
      this.currentWeather = weather;
    });
  }

  ngOnDestroy() {
    this.weatherSubscription?.unsubscribe();
  }

  onWeatherChange(event: CustomEvent) {
    const weather = event.detail.value as WeatherType;
    this.vehicleControl.setWeather(weather);
    this.weatherChange.emit(weather); // Emit the weather value to parent
  }
}