import { DetailComponent } from './detail.component';
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

describe('DetailComponent (integration)', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockSnackBar = { open: jest.fn() };

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
  };

  const mockSession = {
    id: 1,
    name: 'Session 1',
    description: 'Description 1',
    date: new Date(),
    teacher_id: 1,
    users: [1, 2],
  };

  const mockTeacher = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailComponent],
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

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should fetch session and teacher on init', () => {
    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);

    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should delete session, show snackbar and navigate', () => {
    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    TestBed.runInInjectionContext(() => component.delete());

    const deleteReq = httpMock.expectOne('api/session/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 },
    );
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should call participate and refetch session', () => {
    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);

    TestBed.runInInjectionContext(() => component.participate());

    const participateReq = httpMock.expectOne('api/session/1/participate/1');
    expect(participateReq.request.method).toBe('POST');
    participateReq.flush(null);

    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);
  });

  it('should call unParticipate and refetch session', () => {
    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);

    TestBed.runInInjectionContext(() => component.unParticipate());

    const unParticipateReq = httpMock.expectOne('api/session/1/participate/1');
    expect(unParticipateReq.request.method).toBe('DELETE');
    unParticipateReq.flush(null);

    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);
  });

  it('should set isParticipate based on session users', () => {
    httpMock.expectOne('api/session/1').flush(mockSession);
    httpMock.expectOne('api/teacher/1').flush(mockTeacher);

    expect(component.isParticipate).toBe(true);
  });
});
