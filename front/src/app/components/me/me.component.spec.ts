import { MeComponent } from './me.component';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { SessionService } from '../../core/service/session.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      id: 1,
    },
    logOut: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  const matSnackBarMock = {
    open: jest.fn(),
  };

  const mockService = {
    getById: jest.fn().mockReturnValue(of({})),
    delete: jest.fn().mockReturnValue(of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeComponent],
      providers: [
        { provide: UserService, useValue: mockService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideProvider(MatSnackBar, { useValue: matSnackBarMock })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.history.back when back is called', () => {
    const historyBackSpy = jest.spyOn(window.history, 'back');

    component.back();

    expect(historyBackSpy).toHaveBeenCalled();
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
    mockService.getById.mockReturnValue(of(mockUser));

    component.ngOnInit();

    expect(mockService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should delete user, show snackbar, logout and navigate on delete', () => {
    matSnackBarMock.open.mockClear();
    mockSessionService.logOut.mockClear();
    routerMock.navigate.mockClear();
    mockService.delete.mockClear();
    mockService.delete.mockReturnValue(of(null));

    TestBed.runInInjectionContext(() => component.delete());

    expect(mockService.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarMock.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 },
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
