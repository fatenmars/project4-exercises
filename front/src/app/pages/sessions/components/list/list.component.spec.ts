import { ListComponent } from './list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessions = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
    },
  ];

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  const mockSessionService = {
    sessionInformation: {
      id: 1,
      admin: true,
      firstName: 'John',
      lastName: 'Doe',
      username: 'john@test.com',
      token: 'token',
      type: 'Bearer',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch sessions from the API on init', () => {
    expect(mockSessionApiService.all).toHaveBeenCalled();
  });

  it('should expose sessionInformation through user getter', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
  });

  it('should return undefined when no user is logged in', () => {
    mockSessionService.sessionInformation = undefined as any;
    expect(component.user).toBeUndefined();
  });
});
