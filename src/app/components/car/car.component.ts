// car.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VehicleControlService } from 'src/app/service/vehicle-control.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
  standalone: true,
  imports: [],
})
export class CarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private vehicleControl: VehicleControlService) {}

  ngOnInit() {
    // Subscribe to all control changes
    this.subscriptions.push(
      this.vehicleControl.headlightsOn$.subscribe(state => {
        this.frontLightsOn = state;
      }),
      
      this.vehicleControl.backlightsOn$.subscribe(state => {
        this.backlights = state;
      }),
      
      this.vehicleControl.insideLightsOn$.subscribe(state => {
        this.cabinLightsOn = state;
      }),
      
      this.vehicleControl.cleanersActive$.subscribe(state => {
        this.wipersOn = state;
      }),
      
      this.vehicleControl.doorsLocked$.subscribe(state => {
        this.openChasis = !state;
      }),
      
      this.vehicleControl.weather$.subscribe(weather => {
        this.handleWeatherChange(weather);
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private handleWeatherChange(weather: 'soleado' | 'nublado' | 'lluvia' | 'nevado') {
    // Add any weather-specific visual effects here
    console.log('Weather changed to:', weather);
  }

  // Your existing variables
  backlights: boolean = false; 
  cabinLightsOn: boolean = false; 
  frontLightsOn: boolean = false; 
  wipersOn: boolean = false; 
  openChasis: boolean = false;
}