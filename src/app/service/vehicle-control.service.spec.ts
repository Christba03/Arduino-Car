import { TestBed } from '@angular/core/testing';

import { VehicleControlService } from './vehicle-control.service';

describe('VehicleControlService', () => {
  let service: VehicleControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
