import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user by id', () => {
    const mockUser = {
      id: 1,
      email: 'john.doe@example.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: false,
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete user by id', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
