import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { SessionService } from '../../core/service/session.service';

describe('LoginComponent (integration)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        SessionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login user and update session service on successful login', () => {
    const mockResponse = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue({ email: 'test@test.com', password: 'password' });

    TestBed.runInInjectionContext(() => component.submit());

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@test.com',
      password: 'password',
    });

    req.flush(mockResponse);

    expect(sessionService.isLogged).toBe(true);
    expect(sessionService.sessionInformation).toEqual(mockResponse);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on failed login', () => {
    component.form.setValue({ email: 'wrong@test.com', password: 'wrong' });

    TestBed.runInInjectionContext(() => component.submit());

    const req = httpMock.expectOne('/api/auth/login');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(component.onError).toBe(true);
  });
});
