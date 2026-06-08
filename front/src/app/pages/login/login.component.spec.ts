import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';
import { SessionService } from 'src/app/core/service/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn().mockReturnValue(of({})),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should login successfully and navigate to /sessions', () => {
    const mockResponse = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };

    component.form.setValue({ email: 'test@test.com', password: 'password' });
    mockAuthService.login.mockReturnValue(of(mockResponse));

    TestBed.runInInjectionContext(() => component.submit());

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    });
    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockResponse);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true when login fails', () => {
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    mockAuthService.login.mockReturnValue(throwError(() => new Error('error')));

    TestBed.runInInjectionContext(() => component.submit());

    expect(component.onError).toBe(true);
  });
});
