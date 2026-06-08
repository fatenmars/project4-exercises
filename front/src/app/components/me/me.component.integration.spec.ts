import { MeComponent } from './me.component';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../core/service/user.service';
import { SessionService } from '../../core/service/session.service';

describe('MeComponent (integration)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;
  let router: Router;

  const mockSnackBar = { open: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeComponent],
      providers: [
        UserService,
        SessionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
      .overrideProvider(MatSnackBar, { useValue: mockSnackBar })
      .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    });

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should fetch user on init', () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
      password: 'pwd',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    expect(component.user).toEqual(mockUser);
  });

  it('should delete user, logout and navigate', () => {
    httpMock.expectOne('api/user/1').flush({});

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    TestBed.runInInjectionContext(() => component.delete());

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 },
    );
    expect(sessionService.isLogged).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
