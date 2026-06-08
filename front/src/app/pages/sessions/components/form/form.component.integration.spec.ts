import { FormComponent } from './form.component';
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
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { SessionService } from '../../../../core/service/session.service';

describe('FormComponent (integration)', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockSnackBar = { open: jest.fn() };

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
  };

  const mockTeachers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent],
      providers: [
        SessionApiService,
        TeacherService,
        SessionService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideProvider(MatSnackBar, { useValue: mockSnackBar })
      .compileComponents();

    const sessionService = TestBed.inject(SessionService);
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    });

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Override router.url for create mode
    Object.defineProperty(router, 'url', {
      value: '/sessions/create',
      writable: true,
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should initialize teachers$ observable', () => {
    httpMock.expectOne('api/teacher').flush(mockTeachers);
  });

  it('should create session on submit', () => {
    httpMock.expectOne('api/teacher').flush(mockTeachers);

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.sessionForm?.setValue({
      name: 'New Session',
      date: '2026-01-01',
      teacher_id: 1,
      description: 'New description',
    });

    TestBed.runInInjectionContext(() => component.submit());

    const createReq = httpMock.expectOne('api/session');
    expect(createReq.request.method).toBe('POST');
    createReq.flush({ id: 1 });

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 },
    );
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should update session on submit in update mode', () => {
    httpMock.expectOne('api/teacher').flush(mockTeachers);

    Object.defineProperty(router, 'url', {
      value: '/sessions/update/1',
      writable: true,
    });
    TestBed.runInInjectionContext(() => component.ngOnInit());

    httpMock.expectOne('api/session/1').flush({
      id: 1,
      name: 'Existing',
      description: 'Existing desc',
      date: new Date(),
      teacher_id: 1,
      users: [],
    });

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.sessionForm?.setValue({
      name: 'Updated',
      date: '2026-01-01',
      teacher_id: 1,
      description: 'Updated description',
    });

    TestBed.runInInjectionContext(() => component.submit());

    const updateReq = httpMock.expectOne('api/session/1');
    expect(updateReq.request.method).toBe('PUT');
    updateReq.flush({ id: 1 });

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 },
    );
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});
