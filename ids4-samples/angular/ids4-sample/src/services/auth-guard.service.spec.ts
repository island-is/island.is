/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';

describe('Service: AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardService]
    });
  });

  it('should ...', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
