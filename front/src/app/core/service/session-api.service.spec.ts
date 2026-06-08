import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SessionApiService } from './session-api.service';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all sessions', () => {
    const mockSessions = [
      {
        id: '1',
        name: 'Session 1',
        description: 'Description 1',
        date: new Date(),
        teacher_id: 1,
        users: [1, 2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Session 2',
        description: 'Description 2',
        date: new Date(),
        teacher_id: 2,
        users: [3, 4],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should get session detail', () => {
    const mockSession = {
      id: '1',
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe();
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create a session', () => {
    const mockSession = {
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
    };

    service.create(mockSession).subscribe((createdSession) => {
      expect(createdSession).toEqual({
        ...mockSession,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush({
      ...mockSession,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should update a session', () => {
    const mockSession = {
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
    };

    service.update('1', mockSession).subscribe((updatedSession) => {
      expect(updatedSession).toEqual({
        ...mockSession,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush({
      ...mockSession,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should participate in a session', () => {
    service.participate('1', '1').subscribe();
    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should unparticipate in a session', () => {
    service.unParticipate('1', '1').subscribe();
    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
