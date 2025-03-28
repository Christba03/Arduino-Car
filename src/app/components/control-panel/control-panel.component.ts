// control-panel.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomToggleComponent } from "../custom-toggle/custom-toggle.component";
import { VehicleControlService } from 'src/app/service/vehicle-control.service';
import { Subject, takeUntil } from 'rxjs';

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
export class ControlPanelComponent implements OnInit, OnDestroy {
  dayNightMode = false;
  private destroy$ = new Subject<void>();

  constructor(private vehicleControl: VehicleControlService) {}

  ngOnInit() {
    // Initialize with current value
    this.dayNightMode = this.vehicleControl.getDayNightMode();
    
    // Subscribe to dayNightMode changes from the service
    this.vehicleControl.dayNightMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        // Only update if different to prevent infinite loops
        if (this.dayNightMode !== value) {
          this.dayNightMode = value;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDayNightChange() {
    this.vehicleControl.setDayNightMode(this.dayNightMode);
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
  get hornActive(): boolean {
    return this.vehicleControl.getHornState();
  }
  
  set hornActive(state: boolean) {
    this.vehicleControl.setHorn(state);
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
  toggleDayNightMode() {
    const current = this.vehicleControl.getDayNightMode();
    this.vehicleControl.setDayNightMode(!current);
  }
}