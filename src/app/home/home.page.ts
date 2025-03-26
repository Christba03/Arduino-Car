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
import { WeatherType } from '../service/vehicle-control.service'; // Import WeatherType
import { VehicleControlService } from '../service/vehicle-control.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonFooter, IonSegment, IonSegmentButton, IonIcon,
    WeatherBackgroundComponent,
    BuildingBackgroundComponent,
    RoadComponent,
    CarComponent,
    LightRayComponent,
    WeatherFooterComponent,
    ControlPanelComponent
  ]
})
export class HomePage {
  currentWeather: WeatherType = 'soleado'; // Use imported WeatherType
  
  constructor(private vehicleControlService: VehicleControlService) {}

  setWeather(weather: WeatherType) {
    this.currentWeather = weather;
    this.vehicleControlService.setWeather(weather);
  }
}