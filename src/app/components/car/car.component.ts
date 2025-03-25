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
  headlightsOn: boolean = true; // Initialize to false (lights off)
  constructor() { }

  ngOnInit() {}

}
