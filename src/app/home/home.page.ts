import { Component } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonFooter, IonSegment, IonSegmentButton, IonIcon 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms'; // Add this import
import { WeatherBackgroundComponent } from '../components/weather-background/weather-background.component';
import { BuildingBackgroundComponent } from "../components/building-background/building-background.component";
import { RoadComponent } from "../components/road/road.component";
import { CarComponent } from '../components/car/car.component';
import { LightRayComponent } from '../components/light-ray/light-ray.component';
import { WeatherFooterComponent } from '../components/weather-footer/weather-footer.component';
import { ControlPanelComponent } from '../components/control-panel/control-panel.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule, // Add this import
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
  currentWeather: 'soleado' | 'nublado' | 'lluvia' | 'nevado' = 'soleado';
  
  setWeather(weatherType: 'soleado' | 'nublado' | 'lluvia' | 'nevado') {
    this.currentWeather = weatherType;
  }
}