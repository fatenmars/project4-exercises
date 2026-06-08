import { customJwtInterceptorFn } from './customJwtInterceptorFn';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';
import { SessionService } from '../core/service/session.service';

describe('customJwtInterceptorFn (integration)', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService],
    });
    sessionService = TestBed.inject(SessionService);
  });

  it('should not add Authorization header when SessionService says not logged in', () => {
    const request = new HttpRequest('GET', '/api/test');
    const next = jest.fn().mockReturnValue(of({})) as unknown as HttpHandlerFn;

    TestBed.runInInjectionContext(() => {
      customJwtInterceptorFn(request, next);
    });

    const calledRequest = (next as jest.Mock).mock
      .calls[0][0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBeNull();
  });

  it('should add Authorization header after SessionService.logIn', () => {
    sessionService.logIn({
      token: 'integration-token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });

    const request = new HttpRequest('GET', '/api/test');
    const next = jest.fn().mockReturnValue(of({})) as unknown as HttpHandlerFn;

    TestBed.runInInjectionContext(() => {
      customJwtInterceptorFn(request, next);
    });

    const calledRequest = (next as jest.Mock).mock
      .calls[0][0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBe(
      'Bearer integration-token',
    );
  });

  it('should stop adding Authorization header after logOut', () => {
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

    const request = new HttpRequest('GET', '/api/test');
    const next = jest.fn().mockReturnValue(of({})) as unknown as HttpHandlerFn;

    TestBed.runInInjectionContext(() => {
      customJwtInterceptorFn(request, next);
    });

    const calledRequest = (next as jest.Mock).mock
      .calls[0][0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBeNull();
  });

  it('should use the latest token after re-login', () => {
    sessionService.logIn({
      token: 'first-token',
      type: 'Bearer',
      id: 1,
      username: 'a',
      firstName: 'A',
      lastName: 'A',
      admin: false,
    });
    sessionService.logOut();
    sessionService.logIn({
      token: 'second-token',
      type: 'Bearer',
      id: 2,
      username: 'b',
      firstName: 'B',
      lastName: 'B',
      admin: true,
    });

    const request = new HttpRequest('GET', '/api/test');
    const next = jest.fn().mockReturnValue(of({})) as unknown as HttpHandlerFn;

    TestBed.runInInjectionContext(() => {
      customJwtInterceptorFn(request, next);
    });

    const calledRequest = (next as jest.Mock).mock
      .calls[0][0] as HttpRequest<unknown>;
    expect(calledRequest.headers.get('Authorization')).toBe(
      'Bearer second-token',
    );
  });
});
