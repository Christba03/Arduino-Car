// control-panel.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomToggleComponent } from "../custom-toggle/custom-toggle.component";
import { VehicleControlService } from 'src/app/service/vehicle-control.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    CustomToggleComponent
  ]
})
export class ControlPanelComponent {
  constructor(private vehicleControl: VehicleControlService) {}

  // Bind these directly to your template
  get dayNightMode(): boolean {
    return this.vehicleControl.getDayNightMode();
  }
  set dayNightMode(state: boolean) {
    this.vehicleControl.setDayNightMode(state);
  }

  get headlightsOn(): boolean {
    return this.vehicleControl.getHeadlightsState();
  }
  set headlightsOn(state: boolean) {
    this.vehicleControl.setHeadlights(state);
  }

  get backlightsOn(): boolean {
    return this.vehicleControl.getBacklightsState();
  }
  set backlightsOn(state: boolean) {
    this.vehicleControl.setBacklights(state);
  }

  get doorsLocked(): boolean {
    return this.vehicleControl.getDoorsLockedState();
  }
  set doorsLocked(state: boolean) {
    this.vehicleControl.setDoorsLocked(state);
  }

  get cleanersActive(): boolean {
    return this.vehicleControl.getCleanersActiveState();
  }
  set cleanersActive(state: boolean) {
    this.vehicleControl.setCleanersActive(state);
  }

  get insideLightsOn(): boolean {
    return this.vehicleControl.getInsideLightsState();
  }
  set insideLightsOn(state: boolean) {
    this.vehicleControl.setInsideLights(state);
  }

  get musicPlaying(): boolean {
    return this.vehicleControl.getMusicPlayingState();
  }
  set musicPlaying(state: boolean) {
    this.vehicleControl.setMusicPlaying(state);
    this.onMusicToggle(state);
  }

  onMusicToggle(state: boolean) {
    console.log('Music state changed:', state);
    // Add your music control logic here
  }
}