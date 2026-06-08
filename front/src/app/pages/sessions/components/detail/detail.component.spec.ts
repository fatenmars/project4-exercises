import { DetailComponent } from './detail.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../../core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { of } from 'rxjs';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const mockSession = {
    id: 1,
    name: 'Session 1',
    description: 'Description 1',
    date: new Date(),
    teacher_id: 1,
    users: [1, 2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null)),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher)),
  };

  const mockSessionService = {
    sessionInformation: {
      id: 1,
      admin: true,
    },
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1'),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideProvider(MatSnackBar, { useValue: mockMatSnackBar })
      .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session and teacher on init', () => {
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);
    expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should set isParticipate to true if user is in session users', () => {
    expect(component.isParticipate).toBe(true);
  });

  it('should call window.history.back when back is called', () => {
    const historyBackSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should delete session, show snackbar and navigate', () => {
    TestBed.runInInjectionContext(() => component.delete());

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 },
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should call participate and refetch session', () => {
    mockSessionApiService.detail.mockClear();

    TestBed.runInInjectionContext(() => component.participate());

    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('should call unParticipate and refetch session', () => {
    mockSessionApiService.detail.mockClear();

    TestBed.runInInjectionContext(() => component.unParticipate());

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });
});
