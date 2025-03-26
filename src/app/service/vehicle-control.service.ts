// services/vehicle-control.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

export type WeatherType = 'soleado' | 'nublado' | 'lluvia' | 'nevado';

@Injectable({
  providedIn: 'root'
})
export class VehicleControlService {
  // Subjects for all controls
  private dayNightModeSubject = new BehaviorSubject<boolean>(false);
  private headlightsSubject = new BehaviorSubject<boolean>(false);
  private backlightsSubject = new BehaviorSubject<boolean>(false);
  private doorsLockedSubject = new BehaviorSubject<boolean>(true);
  private cleanersActiveSubject = new BehaviorSubject<boolean>(false);
  private insideLightsSubject = new BehaviorSubject<boolean>(false);
  private musicPlayingSubject = new BehaviorSubject<boolean>(false);
  private weatherSubject = new BehaviorSubject<WeatherType>('soleado');
  private honkHornSubject = new BehaviorSubject<void>(undefined);

  // Expose observables
  dayNightMode$ = this.dayNightModeSubject.asObservable().pipe(distinctUntilChanged());
  headlightsOn$ = this.headlightsSubject.asObservable().pipe(distinctUntilChanged());
  backlightsOn$ = this.backlightsSubject.asObservable().pipe(distinctUntilChanged());
  doorsLocked$ = this.doorsLockedSubject.asObservable().pipe(distinctUntilChanged());
  cleanersActive$ = this.cleanersActiveSubject.asObservable().pipe(distinctUntilChanged());
  insideLightsOn$ = this.insideLightsSubject.asObservable().pipe(distinctUntilChanged());
  musicPlaying$ = this.musicPlayingSubject.asObservable().pipe(distinctUntilChanged());
  weather$ = this.weatherSubject.asObservable().pipe(distinctUntilChanged());
  honkHorn$ = this.honkHornSubject.asObservable();

  // Get current values
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

  // Update methods with automatic behaviors
  setDayNightMode(state: boolean) {
    this.dayNightModeSubject.next(state);
    this.updateLightingBasedOnConditions();
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
    this.updateLightingBasedOnConditions();
  }

  honkHorn() {
    this.honkHornSubject.next();
  }

  private updateLightingBasedOnConditions() {
    const isNight = this.getDayNightMode();
    const currentWeather = this.getCurrentWeather();

    // Night mode overrides everything - all lights on
    if (isNight) {
      this.setHeadlights(true);
      this.setBacklights(true);
      this.setInsideLights(true);
      
      // Keep wipers on if it's raining or snowing at night
      if (currentWeather === 'lluvia' || currentWeather === 'nevado') {
        this.setCleanersActive(true);
      } else {
        this.setCleanersActive(false);
      }
      return;
    }

    // Day mode behaviors based on weather
    switch(currentWeather) {
      case 'soleado': // Sunny
        this.setHeadlights(false);
        this.setBacklights(false);
        this.setInsideLights(false);
        this.setCleanersActive(false);
        break;
        
      case 'nublado': // Cloudy
        this.setHeadlights(true);
        this.setBacklights(true);
        this.setInsideLights(false);
        this.setCleanersActive(false);
        break;
        
      case 'lluvia': // Rainy
        this.setHeadlights(true);
        this.setBacklights(true);
        this.setInsideLights(false);
        this.setCleanersActive(true);
        break;
        
      case 'nevado': // Snowy
        this.setHeadlights(true);
        this.setBacklights(true);
        this.setInsideLights(true); // Extra visibility in snow
        this.setCleanersActive(true);
        break;
    }
  }
}