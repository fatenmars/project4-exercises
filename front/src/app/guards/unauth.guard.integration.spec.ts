import { UnauthGuard } from './unauth.guard';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideRouter, Router } from '@angular/router';
import { SessionService } from '../core/service/session.service';

describe('UnauthGuard (integration)', () => {
  let guard: UnauthGuard;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnauthGuard, SessionService, provideRouter([])],
    });
    guard = TestBed.inject(UnauthGuard);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should return true when user is not logged in', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    expect(guard.canActivate()).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should return false and navigate to rentals when user is logged in', () => {
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    expect(guard.canActivate()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['rentals']);
  });

  it('should allow access again after logout', () => {
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });
    sessionService.logOut();

    const navigateSpy = jest.spyOn(router, 'navigate');
    expect(guard.canActivate()).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should react to multiple login/logout cycles', () => {
    expect(guard.canActivate()).toBe(true);

    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    expect(guard.canActivate()).toBe(false);

    sessionService.logOut();
    expect(guard.canActivate()).toBe(true);
  });
});
