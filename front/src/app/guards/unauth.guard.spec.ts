import { UnauthGuard } from './unauth.guard';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Router } from '@angular/router';
import { SessionService } from '../core/service/session.service';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionService = {
    isLogged: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });
    guard = TestBed.inject(UnauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is not logged in', () => {
    mockSessionService.isLogged = false;
    expect(guard.canActivate()).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should return false and navigate to rentals when user is logged in', () => {
    mockSessionService.isLogged = true;
    expect(guard.canActivate()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['rentals']);
  });
});
