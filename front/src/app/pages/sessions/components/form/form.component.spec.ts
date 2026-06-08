import { FormComponent } from './form.component';
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

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

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

  const mockTeachers = [
    {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    create: jest.fn().mockReturnValue(of(mockSession)),
    update: jest.fn().mockReturnValue(of(mockSession)),
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of(mockTeachers)),
  };

  const mockSessionService = {
    sessionInformation: { id: 1, admin: true },
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/sessions/create',
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
      imports: [FormComponent],
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

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect non-admin user to /sessions', () => {
    mockSessionService.sessionInformation.admin = false;
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    mockSessionService.sessionInformation.admin = true; // reset
  });

  it('should initialize form for create mode', () => {
    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm).toBeDefined();
  });

  it('should initialize form for update mode', () => {
    mockRouter.url = '/sessions/update/1';
    TestBed.runInInjectionContext(() => component.ngOnInit());
    expect(component.onUpdate).toBe(true);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    mockRouter.url = '/sessions/create'; // reset
  });

  it('should create a session on submit when not in update mode', () => {
    component.sessionForm?.setValue({
      name: 'Test',
      date: '2026-01-01',
      teacher_id: 1,
      description: 'Test description',
    });

    TestBed.runInInjectionContext(() => component.submit());

    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 },
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should update a session on submit when in update mode', () => {
    mockRouter.url = '/sessions/update/1';
    TestBed.runInInjectionContext(() => component.ngOnInit());

    component.sessionForm?.setValue({
      name: 'Updated',
      date: '2026-01-01',
      teacher_id: 1,
      description: 'Updated description',
    });

    TestBed.runInInjectionContext(() => component.submit());

    expect(mockSessionApiService.update).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 },
    );
    mockRouter.url = '/sessions/create'; // reset
  });
});
