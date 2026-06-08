import { AuthGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideRouter, Router } from '@angular/router';
import { SessionService } from '../core/service/session.service';

describe('AuthGuard (integration)', () => {
  let guard: AuthGuard;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, SessionService, provideRouter([])],
    });
    guard = TestBed.inject(AuthGuard);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should return true when SessionService reports user as logged in', () => {
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });

    const navigateSpy = jest.spyOn(router, 'navigate');
    expect(guard.canActivate()).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should return false and navigate to login when user is not logged in', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    expect(guard.canActivate()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });

  it('should reflect logout state after logIn then logOut', () => {
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });
    expect(guard.canActivate()).toBe(true);

    sessionService.logOut();
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    expect(guard.canActivate()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });
});
