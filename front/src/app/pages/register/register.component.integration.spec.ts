import { RegisterComponent } from './register.component';
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

describe('RegisterComponent (integration)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register user and navigate to login on success', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    const formData = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    };
    component.form.setValue(formData);

    TestBed.runInInjectionContext(() => component.submit());

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formData);

    req.flush(null);

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true on failed register', () => {
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });

    TestBed.runInInjectionContext(() => component.submit());

    const req = httpMock.expectOne('/api/auth/register');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

    expect(component.onError).toBe(true);
  });
});
