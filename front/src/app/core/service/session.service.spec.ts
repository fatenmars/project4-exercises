import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLogged false and sessionInformation undefined', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should set isLogged to true and sessionInformation on logIn', () => {
    const mockUser = {
      token: 'mockToken',
      type: 'mockType',
      id: 1,
      username: 'mockUser',
      firstName: 'Mock',
      lastName: 'User',
      admin: false,
    };

    service.logIn(mockUser);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('should set isLogged to false and sessionInformation to undefined on logOut', () => {
    const mockUser = {
      token: 'mockToken',
      type: 'mockType',
      id: 1,
      username: 'mockUser',
      firstName: 'Mock',
      lastName: 'User',
      admin: false,
    };

    service.logIn(mockUser);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockUser);

    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit isLogged changes through $isLogged observable', () => {
    const emittedValues: boolean[] = [];

    service.$isLogged().subscribe((value) => {
      emittedValues.push(value);
    });

    service.logIn({
      token: 'mockToken',
      type: 'mockType',
      id: 1,
      username: 'mockUser',
      firstName: 'Mock',
      lastName: 'User',
      admin: false,
    });

    service.logOut();

    expect(emittedValues).toEqual([false, true, false]);
  });
});
