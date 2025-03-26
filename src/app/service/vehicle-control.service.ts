// services/vehicle-control.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type WeatherType = 'soleado' | 'nublado' | 'lluvia' | 'nevado';

@Injectable({
  providedIn: 'root'
})
export class VehicleControlService {
  private dayNightModeSubject = new BehaviorSubject<boolean>(false);
  private headlightsSubject = new BehaviorSubject<boolean>(false);
  private backlightsSubject = new BehaviorSubject<boolean>(false);
  private doorsLockedSubject = new BehaviorSubject<boolean>(true);
  private cleanersActiveSubject = new BehaviorSubject<boolean>(false);
  private insideLightsSubject = new BehaviorSubject<boolean>(false);
  private musicPlayingSubject = new BehaviorSubject<boolean>(false);
  private weatherSubject = new BehaviorSubject<WeatherType>('soleado');

  // Expose observables
  dayNightMode$ = this.dayNightModeSubject.asObservable();
  headlightsOn$ = this.headlightsSubject.asObservable();
  backlightsOn$ = this.backlightsSubject.asObservable();
  doorsLocked$ = this.doorsLockedSubject.asObservable();
  cleanersActive$ = this.cleanersActiveSubject.asObservable();
  insideLightsOn$ = this.insideLightsSubject.asObservable();
  musicPlaying$ = this.musicPlayingSubject.asObservable();
  weather$ = this.weatherSubject.asObservable();

  getDayNightMode(): boolean {
    return this.dayNightModeSubject.value;
  }

  getHeadlightsState(): boolean {
    return this.headlightsSubject.value;
  }

  getBacklightsState(): boolean {
    return this.backlightsSubject.value;
  }

  getDoorsLockedState(): boolean {
    return this.doorsLockedSubject.value;
  }

  getCleanersActiveState(): boolean {
    return this.cleanersActiveSubject.value;
  }

  getInsideLightsState(): boolean {
    return this.insideLightsSubject.value;
  }

  getMusicPlayingState(): boolean {
    return this.musicPlayingSubject.value;
  }

  getCurrentWeather(): WeatherType {
    return this.weatherSubject.value;
  }

  // Update methods
  setDayNightMode(state: boolean) {
    this.dayNightModeSubject.next(state);
  }

  setHeadlights(state: boolean) {
    this.headlightsSubject.next(state);
  }

  setBacklights(state: boolean) {
    this.backlightsSubject.next(state);
  }

  setDoorsLocked(state: boolean) {
    this.doorsLockedSubject.next(state);
  }

  setCleanersActive(state: boolean) {
    this.cleanersActiveSubject.next(state);
  }

  setInsideLights(state: boolean) {
    this.insideLightsSubject.next(state);
  }

  setMusicPlaying(state: boolean) {
    this.musicPlayingSubject.next(state);
  }

  setWeather(weather: WeatherType) {
    this.weatherSubject.next(weather);
    
    if (weather === 'lluvia' || weather === 'nevado') {
      this.setCleanersActive(true);
    } else {
      this.setCleanersActive(false);
    }
    
    if (weather === 'nublado' || weather === 'lluvia' || weather === 'nevado') {
      this.setHeadlights(true);
    }
  }
}