import { customJwtInterceptorFn } from './customJwtInterceptorFn';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { HttpRequest } from '@angular/common/http';
import { SessionService } from '../core/service/session.service';
import { of } from 'rxjs';

describe('customJwtInterceptorFn', () => {
  const mockSessionService = {
    isLogged: false,
    sessionInformation: {
      token: 'fake-token',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    });
  });

  it('should add Authorization header when user is logged in', () => {
    mockSessionService.isLogged = true;
    const request = new HttpRequest('GET', '/api/test');
    const next = jest.fn().mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      customJwtInterceptorFn(request, next as any);
    });

    const calledRequest = (next as jest.Mock).mock
      .calls[0][0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBe(
      'Bearer fake-token',
    );
  });

  it('should not add Authorization header when user is not logged in', () => {
    mockSessionService.isLogged = false;
    const request = new HttpRequest('GET', '/api/test');
    const next = jest.fn().mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      customJwtInterceptorFn(request, next as any);
    });

    const calledRequest = (next as jest.Mock).mock
      .calls[0][0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBeNull();
  });
});
