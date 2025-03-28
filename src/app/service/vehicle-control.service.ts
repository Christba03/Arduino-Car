import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, interval, Subscription, switchMap, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type WeatherType = 'soleado' | 'nublado' | 'lluvia' | 'nevado';

interface ApiState {
  dayNightMode: boolean;
  headlights: boolean;
  insideLights: boolean;
  backlights: boolean; 
  cleanersActive: boolean;
  honkHorn: boolean;
  doorsLocked: boolean; 
  musicPlaying: boolean;
  weather: WeatherType;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleControlService implements OnDestroy {
  private apiUrl = 'http://localhost:3001/arduino/vehicle-state';
  private pollingInterval = 3000; // 5 seconds
  private pollingSubscription!: Subscription;
  private updateQueue: Partial<ApiState> = {};
  private updateTimeout: any;
  private isUpdating = false;

  // Audio handling
  private hornAudio: HTMLAudioElement;
  private isHornPlaying = false;
  private musicAudio: HTMLAudioElement;
  private isMusicPlaying = false;

  // BehaviorSubjects for all controls
  private dayNightModeSubject = new BehaviorSubject<boolean>(false);
  private headlightsSubject = new BehaviorSubject<boolean>(false);
  private backlightsSubject = new BehaviorSubject<boolean>(false);
  private doorsLockedSubject = new BehaviorSubject<boolean>(true);
  private cleanersActiveSubject = new BehaviorSubject<boolean>(false);
  private insideLightsSubject = new BehaviorSubject<boolean>(false);
  private musicPlayingSubject = new BehaviorSubject<boolean>(false);
  private weatherSubject = new BehaviorSubject<WeatherType>('soleado');
  private honkHornSubject = new BehaviorSubject<boolean>(false);

  // Exposed observables
  dayNightMode$ = this.dayNightModeSubject.asObservable().pipe(distinctUntilChanged());
  headlightsOn$ = this.headlightsSubject.asObservable().pipe(distinctUntilChanged());
  backlightsOn$ = this.backlightsSubject.asObservable().pipe(distinctUntilChanged());
  doorsLocked$ = this.doorsLockedSubject.asObservable().pipe(distinctUntilChanged());
  cleanersActive$ = this.cleanersActiveSubject.asObservable().pipe(distinctUntilChanged());
  insideLightsOn$ = this.insideLightsSubject.asObservable().pipe(distinctUntilChanged());
  musicPlaying$ = this.musicPlayingSubject.asObservable().pipe(distinctUntilChanged());
  weather$ = this.weatherSubject.asObservable().pipe(distinctUntilChanged());
  honkHorn$ = this.honkHornSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {
    // Initialize horn audio
    this.hornAudio = new Audio();
    this.hornAudio.src = 'assets/claxon.mp3'; // Update this path to your horn sound file
    this.hornAudio.load();
    this.hornAudio.loop = true;

    // Initialize music audio
    this.musicAudio = new Audio();
    this.musicAudio.src = 'assets/music.mp3'; // Update path to your music file
    this.musicAudio.load();
    this.musicAudio.loop = true;

    // Subscribe to horn state changes
    this.honkHorn$.subscribe(state => this.handleHornSound(state));
    this.musicPlaying$.subscribe(state => this.handleMusicSound(state));

    this.loadInitialState();
    this.startPolling();
  }

  private handleHornSound(state: boolean): void {
    if (state && !this.isHornPlaying) {
      this.hornAudio.play()
        .then(() => this.isHornPlaying = true)
        .catch(e => console.error('Error playing horn sound:', e));
    } else if (!state && this.isHornPlaying) {
      this.hornAudio.pause();
      this.hornAudio.currentTime = 0;
      this.isHornPlaying = false;
    }
  }
  private handleMusicSound(state: boolean): void {
    if (state && !this.isMusicPlaying) {
      this.musicAudio.play()
        .then(() => this.isMusicPlaying = true)
        .catch(e => console.error('Error playing music:', e));
    } else if (!state && this.isMusicPlaying) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.isMusicPlaying = false;
    }
  }

  startPolling(): void {
    this.pollingSubscription = interval(this.pollingInterval).pipe(
      switchMap(() => this.http.get<ApiState>(this.apiUrl)),
      filter(() => !this.isUpdating)
    ).subscribe({
      next: (state) => {
        console.log('Polling update received:', state);
        this.updateLocalState(state, true);
      },
      error: (err) => console.error('Polling error:', err)
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private updateLocalState(state: ApiState, fromPolling: boolean = false): void {
    if (!state) return;
    
    if (state.dayNightMode !== this.dayNightModeSubject.value) {
      this.dayNightModeSubject.next(state.dayNightMode);
      if (!fromPolling) this.queueUpdate({ dayNightMode: state.dayNightMode });
    }
    if (state.headlights !== this.headlightsSubject.value) {
      this.headlightsSubject.next(state.headlights);
      if (!fromPolling) this.queueUpdate({ headlights: state.headlights });
    }
    if (state.insideLights !== this.insideLightsSubject.value) {
      this.insideLightsSubject.next(state.insideLights);
      if (!fromPolling) this.queueUpdate({ insideLights: state.insideLights });
    }
    if (state.backlights !== this.backlightsSubject.value) {
      this.backlightsSubject.next(state.backlights);
      if (!fromPolling) this.queueUpdate({ backlights: state.backlights });
    }
    if (state.cleanersActive !== this.cleanersActiveSubject.value) {
      this.cleanersActiveSubject.next(state.cleanersActive);
      if (!fromPolling) this.queueUpdate({ cleanersActive: state.cleanersActive });
    }
    if (state.doorsLocked !== this.doorsLockedSubject.value) {
      this.doorsLockedSubject.next(state.doorsLocked);
      if (!fromPolling) this.queueUpdate({ doorsLocked: state.doorsLocked });
    }
    if (state.honkHorn !== undefined && state.honkHorn !== this.honkHornSubject.value) {
      this.honkHornSubject.next(state.honkHorn);
      if (!fromPolling) this.queueUpdate({ honkHorn: state.honkHorn });
    }
    if (state.musicPlaying !== undefined && state.musicPlaying !== this.musicPlayingSubject.value) {
      this.musicPlayingSubject.next(state.musicPlaying);
      if (!fromPolling) this.queueUpdate({ musicPlaying: state.musicPlaying });
    }
  }

  private queueUpdate(update: Partial<ApiState>): void {
    this.updateQueue = { ...this.updateQueue, ...update };
    
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    this.updateTimeout = setTimeout(() => {
      this.sendQueuedUpdates();
    }, 300);
  }

  private sendQueuedUpdates(): void {
    if (Object.keys(this.updateQueue).length === 0) return;
    
    this.isUpdating = true;
    const updatesToSend = { ...this.updateQueue };
    this.updateQueue = {};
    
    console.log('Sending queued updates:', updatesToSend);
    this.http.put(this.apiUrl, updatesToSend, { observe: 'response' }).subscribe({
      next: (response) => {
        console.log('Update successful:', response.status);
        this.isUpdating = false;
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.isUpdating = false;
      }
    });
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

  getHornState(): boolean {
    return this.honkHornSubject.value;
  }

  getCurrentWeather(): WeatherType {
    return this.weatherSubject.value;
  }

  // ========== SETTER METHODS ==========
  setDayNightMode(state: boolean): void {
    if (this.dayNightModeSubject.value !== state) {
      this.dayNightModeSubject.next(state);
      this.queueUpdate({ dayNightMode: state });
      this.updateLightingBasedOnConditions();
    }
  }

  setHeadlights(state: boolean): void {
    if (this.headlightsSubject.value !== state) {
      this.headlightsSubject.next(state);
      this.queueUpdate({ headlights: state });
    }
  }

  setBacklights(state: boolean): void {
    if (this.backlightsSubject.value !== state) {
      this.backlightsSubject.next(state);
      this.queueUpdate({ backlights: state });
    }
  }

  setDoorsLocked(state: boolean): void {
    if (this.doorsLockedSubject.value !== state) {
      this.doorsLockedSubject.next(state);
      this.queueUpdate({ doorsLocked: state });
    }
  }

  setCleanersActive(state: boolean): void {
    if (this.cleanersActiveSubject.value !== state) {
      this.cleanersActiveSubject.next(state);
      this.queueUpdate({ cleanersActive: state });
    }
  }

  setInsideLights(state: boolean): void {
    if (this.insideLightsSubject.value !== state) {
      this.insideLightsSubject.next(state);
      this.queueUpdate({ insideLights: state });
    }
  }

  setMusicPlaying(state: boolean): void {
    if (this.musicPlayingSubject.value !== state) {
      this.musicPlayingSubject.next(state);
      this.queueUpdate({ musicPlaying: state });
    }
  }

  setHorn(state: boolean): void {
    if (this.honkHornSubject.value !== state) {
      this.honkHornSubject.next(state);
      this.queueUpdate({ honkHorn: state });
    }
  }

  setWeather(weather: WeatherType): void {
    if (this.weatherSubject.value !== weather) {
      this.weatherSubject.next(weather);
      this.updateLightingBasedOnConditions();
    }
  }

  honkHorn(): void {
    this.setHorn(true);
  }

  flushUpdates(): void {
    if (Object.keys(this.updateQueue).length > 0) {
      this.sendQueuedUpdates();
    }
  }

  private loadInitialState(): void {
    this.http.get<ApiState>(this.apiUrl).subscribe({
      next: (state) => {
        if (state) {
          console.log('Initial state loaded:', state);
          this.updateLocalState(state, true);
        }
      },
      error: (err) => console.error('Error loading initial state:', err)
    });
  }

  private updateLightingBasedOnConditions(): void {
    const isNight = this.getDayNightMode();
    const currentWeather = this.getCurrentWeather();

    if (isNight) {
      this.setHeadlights(true);
      this.setBacklights(true);
      this.setInsideLights(true);
      
      if (currentWeather === 'lluvia' || currentWeather === 'nevado') {
        this.setCleanersActive(true);
      } else {
        this.setCleanersActive(false);
      }
      return;
    }

    switch(currentWeather) {
      case 'soleado':
        this.setHeadlights(false);
        this.setBacklights(false);
        this.setInsideLights(false);
        this.setCleanersActive(false);
        break;
        
      case 'nublado':
        this.setHeadlights(true);
        this.setBacklights(true);
        this.setInsideLights(false);
        this.setCleanersActive(false);
        break;
        
      case 'lluvia':
        this.setHeadlights(true);
        this.setBacklights(true);
        this.setInsideLights(false);
        this.setCleanersActive(true);
        break;
        
      case 'nevado':
        this.setHeadlights(true);
        this.setBacklights(true);
        this.setInsideLights(true);
        this.setCleanersActive(true);
        break;
    }
  }

  ngOnDestroy(): void {
    this.hornAudio.pause();
    this.hornAudio.remove();
    this.musicAudio.pause();
    this.musicAudio.remove();
    
    this.stopPolling();
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.flushUpdates();
  }
}