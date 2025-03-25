import { Component, OnInit } from '@angular/core';
import { CustomToggleComponent } from "../custom-toggle/custom-toggle.component";
import { FormsModule } from '@angular/forms'; // Add this import
import { CommonModule } from '@angular/common'; // Recommended for standalone components

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  standalone:true,
  imports: [    
    CommonModule,
    FormsModule, // Add this to enable ngModel
    CustomToggleComponent]
})
export class ControlPanelComponent{
  // Toggle states
  dayNightMode: boolean = false;
  headlightsOn: boolean = false;
  backlightsOn: boolean = false;
  doorsLocked: boolean = true;
  cleanersActive: boolean = false;
  insideLightsOn: boolean = false;
  musicPlaying: boolean = false;

  // Add any specific toggle handlers if needed
  onMusicToggle(state: boolean) {
    console.log('Music state changed:', state);
    // Add your music control logic here
  }
}
