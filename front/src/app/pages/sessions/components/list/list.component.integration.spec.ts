import { ListComponent } from './list.component';
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
import { provideRouter } from '@angular/router';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';

describe('ListComponent (integration)', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        SessionApiService,
        SessionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionService.logIn({
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch sessions from API and expose them via sessions$', (done) => {
    const mockSessions = [
      {
        id: 1,
        name: 'Yoga 1',
        description: 'Desc 1',
        date: new Date(),
        teacher_id: 1,
        users: [],
      },
    ];

    component.sessions$.subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
      done();
    });

    const reqs = httpMock.match('api/session');
    expect(reqs.length).toBeGreaterThan(0);
    reqs.forEach((req) => req.flush(mockSessions));
  });
  it('should expose logged-in user via user getter', () => {
    expect(component.user?.admin).toBe(true);
    expect(component.user?.username).toBe('test@test.com');

    httpMock.expectOne('api/session').flush([]);
  });
});
