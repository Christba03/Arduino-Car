import { Component, OnInit } from '@angular/core';
import { IonContent, IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.scss'],
  standalone: true,
  imports: [IonContent]
})
export class RoadComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
