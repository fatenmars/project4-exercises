import { RegisterComponent } from './register.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService = {
    register: jest.fn().mockReturnValue(of(undefined)),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should register successfully and navigate to /login', () => {
    const mockRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    };

    component.form.setValue(mockRequest);
    mockAuthService.register.mockReturnValue(of(undefined));

    TestBed.runInInjectionContext(() => component.submit());

    expect(mockAuthService.register).toHaveBeenCalledWith(mockRequest);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true when register fails', () => {
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });
    mockAuthService.register.mockReturnValue(
      throwError(() => new Error('error')),
    );

    TestBed.runInInjectionContext(() => component.submit());

    expect(component.onError).toBe(true);
  });
});
