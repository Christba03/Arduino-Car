import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, interval, Subscription, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type WeatherType = 'soleado' | 'nublado' | 'lluvia' | 'nevado';

interface ApiState {
  dayNightMode: boolean;
  headlights: boolean;
  insideLights: boolean;
  cleanersActive: boolean;
  honkHorn: boolean;
  doorsLocked: boolean;
  musicPlaying: boolean;
  weather: WeatherType;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleControlService {
  private apiUrl = 'http://localhost:3001/arduino/vehicle-state';

  private pollingInterval = 5000; // 5 seconds
  private pollingSubscription!: Subscription;

  
  // BehaviorSubjects for all controls
  private dayNightModeSubject = new BehaviorSubject<boolean>(false);
  private headlightsSubject = new BehaviorSubject<boolean>(false);
  private backlightsSubject = new BehaviorSubject<boolean>(false);
  private doorsLockedSubject = new BehaviorSubject<boolean>(true);
  private cleanersActiveSubject = new BehaviorSubject<boolean>(false);
  private insideLightsSubject = new BehaviorSubject<boolean>(false);
  private musicPlayingSubject = new BehaviorSubject<boolean>(false);
  private weatherSubject = new BehaviorSubject<WeatherType>('soleado');
  private honkHornSubject = new BehaviorSubject<void>(undefined);

  // Exposed observables
  dayNightMode$ = this.dayNightModeSubject.asObservable().pipe(distinctUntilChanged());
  headlightsOn$ = this.headlightsSubject.asObservable().pipe(distinctUntilChanged());
  backlightsOn$ = this.backlightsSubject.asObservable().pipe(distinctUntilChanged());
  doorsLocked$ = this.doorsLockedSubject.asObservable().pipe(distinctUntilChanged());
  cleanersActive$ = this.cleanersActiveSubject.asObservable().pipe(distinctUntilChanged());
  insideLightsOn$ = this.insideLightsSubject.asObservable().pipe(distinctUntilChanged());
  musicPlaying$ = this.musicPlayingSubject.asObservable().pipe(distinctUntilChanged());
  weather$ = this.weatherSubject.asObservable().pipe(distinctUntilChanged());
  honkHorn$ = this.honkHornSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialState();
    this.startPolling();
  }

  startPolling(): void {
    this.pollingSubscription = interval(this.pollingInterval).pipe(
      // Use switchMap to cancel previous requests if new one comes in
      switchMap(() => this.http.get<ApiState>(this.apiUrl))
    ).subscribe({
      next: (state) => {
        console.log('Polling update received:', state);
        this.updateLocalState(state);
      },
      error: (err) => console.error('Polling error:', err)
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private updateLocalState(state: ApiState): void {
    if (!state) return;
    
    // Only update if values are different to avoid unnecessary change detection
    if (state.dayNightMode !== this.dayNightModeSubject.value) {
      this.dayNightModeSubject.next(state.dayNightMode);
    }
    if (state.headlights !== this.headlightsSubject.value) {
      this.headlightsSubject.next(state.headlights);
    }
    // Update other subjects as needed...
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  // ========== GETTER METHODS ==========
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

  // ========== SETTER METHODS ==========
  setDayNightMode(state: boolean): void {
    this.dayNightModeSubject.next(state);
    this.updateBackend({ dayNightMode: state });
    this.updateLightingBasedOnConditions();
  }

  setHeadlights(state: boolean): void {
    this.headlightsSubject.next(state);
    this.updateBackend({ headlights: state });
  }

  setBacklights(state: boolean): void {
    this.backlightsSubject.next(state);
    // Not in API, so no backend update
  }

  setDoorsLocked(state: boolean): void {
    this.doorsLockedSubject.next(state);
    // Not in API, so no backend update
  }

  setCleanersActive(state: boolean): void {
    this.cleanersActiveSubject.next(state);
    this.updateBackend({ cleanersActive: state });
  }

  setInsideLights(state: boolean): void {
    this.insideLightsSubject.next(state);
    this.updateBackend({ insideLights: state });
  }

  setMusicPlaying(state: boolean): void {
    this.musicPlayingSubject.next(state);
    // Not in API, so no backend update
  }

  setWeather(weather: WeatherType): void {
    this.weatherSubject.next(weather);
    this.updateLightingBasedOnConditions();
    // Not in API, so no backend update
  }

  honkHorn(): void {
    this.honkHornSubject.next();
    this.updateBackend({ honkHorn: true });
    setTimeout(() => {
      this.updateBackend({ honkHorn: false });
    }, 500);
  }

  // ========== PRIVATE METHODS ==========
  private loadInitialState(): void {
    this.http.get<ApiState>(this.apiUrl).subscribe({
      next: (state) => {
        if (state) {
          console.log('Initial state loaded:', state);
          this.dayNightModeSubject.next(state.dayNightMode);
          this.headlightsSubject.next(state.headlights);
          this.insideLightsSubject.next(state.insideLights);
          this.cleanersActiveSubject.next(state.cleanersActive);
        }
      },
      error: (err) => console.error('Error loading initial state:', err)
    });
  }

  private updateBackend(data: Partial<ApiState>): void {
    console.log('Updating backend with:', data);
    this.http.put(this.apiUrl, data, { observe: 'response' }).subscribe({
      next: (response) => {
        console.log('Update successful:', response.status);
      },
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }

  private updateLightingBasedOnConditions(): void {
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
        this.setInsideLights(true);
        this.setCleanersActive(true);
        break;
    }
  }
}