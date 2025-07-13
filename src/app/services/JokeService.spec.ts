import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JokeService } from './JokeService';
import { JokeAPI } from '../api/JokeAPI';
import { Joke } from '../models/Joke';
import { of, throwError } from 'rxjs';

describe('JokeService', () => {
  let service: JokeService;
  let jokeApiSpy: jasmine.SpyObj<JokeAPI>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('JokeAPI', [
      'getRandomJoke',
      'getAllJokes',
      'createJoke',
      'updateJoke',
      'deleteJoke',
      'getJokeById'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JokeService,
        { provide: JokeAPI, useValue: spy }
      ]
    });

    service = TestBed.inject(JokeService);
    jokeApiSpy = TestBed.inject(JokeAPI) as jasmine.SpyObj<JokeAPI>;
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

    jokeApiSpy.getRandomJoke.and.returnValue(of(mockJoke));

    service.getRandomJoke();

    expect(service.randomJoke()).toEqual(mockJoke);
    expect(service.loading()).toBeFalsy();
    expect(service.error()).toBeNull();
  });

  it('should handle error when getting random joke', () => {
    const errorMessage = 'API Error';
    jokeApiSpy.getRandomJoke.and.returnValue(throwError(() => new Error(errorMessage)));

    service.getRandomJoke();

    expect(service.error()).toBe('Erreur lors du chargement de la blague');
    expect(service.loading()).toBeFalsy();
  });

  it('should get all jokes with pagination', () => {
    const mockJokes: Joke[] = [
      { id: 1, joke: 'Joke 1', created_at: new Date() },
      { id: 2, joke: 'Joke 2', created_at: new Date() }
    ];
    const mockResponse = { jokes: mockJokes, total: 2 };

    jokeApiSpy.getAllJokes.and.returnValue(of(mockResponse));

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
    const mockResponse = { jokes: mockJokes, total: 25 };

    jokeApiSpy.getAllJokes.and.returnValue(of(mockResponse));

    service.getAllJokes(0, 10);

    expect(service.totalPages()).toBe(3); // 25 jokes / 10 per page = 3 pages
  });

  it('should handle navigation correctly', () => {
    const mockResponse = { jokes: [], total: 25 };
    jokeApiSpy.getAllJokes.and.returnValue(of(mockResponse));

    // Test navigation
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
