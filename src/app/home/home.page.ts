import { Component } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonFooter, IonSegment, IonSegmentButton, IonIcon 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { WeatherBackgroundComponent } from '../components/weather-background/weather-background.component';
import { BuildingBackgroundComponent } from "../components/building-background/building-background.component";
import { RoadComponent } from "../components/road/road.component";
import { CarComponent } from '../components/car/car.component';
import { LightRayComponent } from '../components/light-ray/light-ray.component';
import { WeatherFooterComponent } from '../components/weather-footer/weather-footer.component';
import { ControlPanelComponent } from '../components/control-panel/control-panel.component';
import { WeatherType } from '../service/vehicle-control.service';
import { VehicleControlService } from '../service/vehicle-control.service';
import { GrayscaleFilterComponent } from '../components/grayscale-filter/grayscale-filter.component';
import { AsyncPipe, NgIf } from '@angular/common'; // Added NgIf
import { startWith } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    WeatherBackgroundComponent,
    BuildingBackgroundComponent,
    RoadComponent,
    CarComponent,
    LightRayComponent,
    WeatherFooterComponent,
    ControlPanelComponent,
    GrayscaleFilterComponent,
    AsyncPipe,
    NgIf,
    HttpClientModule
  ]
})
export class HomePage {
  currentWeather: WeatherType = 'soleado';
  dayNightMode$ = this.vehicleControlService.dayNightMode$.pipe(
    startWith(false)
  );
  
  constructor(private vehicleControlService: VehicleControlService) {}

  setWeather(weather: WeatherType) {
    this.currentWeather = weather;
    this.vehicleControlService.setWeather(weather);
  }
}