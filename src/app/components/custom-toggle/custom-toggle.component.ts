import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-toggle',
  templateUrl: './custom-toggle.component.html',
  styleUrls: ['./custom-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomToggleComponent),
      multi: true
    }
  ],
  standalone: true
})
export class CustomToggleComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Output() changed = new EventEmitter<boolean>();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  toggle() {
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.changed.emit(this.checked);
  }

  // ControlValueAccessor methods
  writeValue(value: boolean): void {
    this.checked = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}