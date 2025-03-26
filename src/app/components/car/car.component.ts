import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
  standalone: true,
  imports: [IonContent],
  
})
export class CarComponent  implements OnInit {
  backlights: boolean = false; // Initialize to false (lights off)
  cabinLightsOn: boolean = false; // For white cabin lights
  frontLightsOn: boolean = false; 
  wipersOn: boolean = true; // Control wiper animation

  constructor() { }

  ngOnInit() {}

}
