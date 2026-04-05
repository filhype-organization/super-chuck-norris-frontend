import '../../test-helpers/test-init';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { JokeService } from './JokeService';
import { JokeAPI } from '../api/JokeAPI';
import { Joke } from '../models/Joke';
import { of, throwError } from 'rxjs';
import { EnvironmentMock } from '../../test-helpers/environment-mock';

describe('JokeService', () => {
  let service: JokeService;
  let jokeApiSpy: {
    getRandomJoke: ReturnType<typeof vi.fn>;
    getAllJokes: ReturnType<typeof vi.fn>;
    createJoke: ReturnType<typeof vi.fn>;
    updateJoke: ReturnType<typeof vi.fn>;
    deleteJoke: ReturnType<typeof vi.fn>;
    getJokeById: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    EnvironmentMock.setup();

    jokeApiSpy = {
      getRandomJoke: vi.fn(),
      getAllJokes: vi.fn(),
      createJoke: vi.fn(),
      updateJoke: vi.fn(),
      deleteJoke: vi.fn(),
      getJokeById: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        JokeService,
        { provide: JokeAPI, useValue: jokeApiSpy }
      ]
    });

    service = TestBed.inject(JokeService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    EnvironmentMock.cleanup();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get random joke successfully', () => {
    const mockJoke: Joke = {
      id: 1,
      joke: 'Chuck Norris can divide by zero.',
      created_at: new Date()
    };

    jokeApiSpy.getRandomJoke.mockReturnValue(of(mockJoke));

    service.getRandomJoke();

    expect(service.randomJoke()).toEqual(mockJoke);
    expect(service.loading()).toBeFalsy();
    expect(service.error()).toBeNull();
  });

  it('should handle error when getting random joke', () => {
    jokeApiSpy.getRandomJoke.mockReturnValue(throwError(() => new Error('API Error')));

    service.getRandomJoke();

    expect(service.error()).toBe('Erreur lors du chargement de la blague');
    expect(service.loading()).toBeFalsy();
  });

  it('should get all jokes with pagination', () => {
    const mockJokes: Joke[] = [
      { id: 1, joke: 'Joke 1', created_at: new Date() },
      { id: 2, joke: 'Joke 2', created_at: new Date() }
    ];

    jokeApiSpy.getAllJokes.mockReturnValue(of({ jokes: mockJokes, total: 2 }));

    service.getAllJokes(0, 10);

    expect(service.jokes()).toEqual(mockJokes);
    expect(service.totalJokes()).toBe(2);
    expect(service.loading()).toBeFalsy();
    expect(service.error()).toBeNull();
  });

  it('should calculate total pages correctly', () => {
    const mockJokes: Joke[] = [
      { id: 1, joke: 'Joke 1', created_at: new Date() },
      { id: 2, joke: 'Joke 2', created_at: new Date() }
    ];

    jokeApiSpy.getAllJokes.mockReturnValue(of({ jokes: mockJokes, total: 25 }));

    service.getAllJokes(0, 10);

    expect(service.totalPages()).toBe(3);
  });

  it('should handle navigation correctly', () => {
    jokeApiSpy.getAllJokes.mockReturnValue(of({ jokes: [], total: 25 }));

    service.getAllJokes(0, 10);
    expect(service.hasPreviousPage()).toBeFalsy();
    expect(service.hasNextPage()).toBeTruthy();

    service.getAllJokes(1, 10);
    expect(service.hasPreviousPage()).toBeTruthy();
    expect(service.hasNextPage()).toBeTruthy();

    service.getAllJokes(2, 10);
    expect(service.hasPreviousPage()).toBeTruthy();
    expect(service.hasNextPage()).toBeFalsy();
  });
});
