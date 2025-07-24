import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JokeAPI } from './JokeAPI';
import { Joke } from '../models/Joke';
import { EnvironmentMock } from '../../test-helpers/environment-mock';

describe('JokeAPI', () => {
  let service: JokeAPI;
  let httpMock: HttpTestingController;
  const baseUrl = '/api/v1/jokes';

  beforeEach(() => {
    // Configuration de l'environnement de test
    EnvironmentMock.setup();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JokeAPI]
    });
    service = TestBed.inject(JokeAPI);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Nettoyage après chaque test
    EnvironmentMock.cleanup();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get random joke', () => {
    const mockJoke: Joke = {
      id: 1,
      joke: 'Chuck Norris can divide by zero.',
      created_at: new Date()
    };

    service.getRandomJoke().subscribe(joke => {
      expect(joke).toEqual(mockJoke);
    });

    const req = httpMock.expectOne(`${baseUrl}/getRandomJoke`);
    expect(req.request.method).toBe('GET');
    req.flush(mockJoke);
  });

  it('should get all jokes with pagination', () => {
    const mockJokes: Joke[] = [
      { id: 1, joke: 'Joke 1', created_at: new Date() },
      { id: 2, joke: 'Joke 2', created_at: new Date() }
    ];

    service.getAllJokes(0, 10).subscribe(result => {
      expect(result.jokes).toEqual(mockJokes);
      expect(result.total).toBe(2);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    
    // Simuler la réponse avec le header X-Total-Count
    req.flush(mockJokes, { headers: { 'X-Total-Count': '2' } });
  });

  it('should create a joke', () => {
    const newJoke: Joke = {
      id: null,
      joke: 'New Chuck Norris joke',
      created_at: new Date()
    };
    const createdJoke: Joke = { ...newJoke, id: 1 };

    service.createJoke(newJoke).subscribe(joke => {
      expect(joke).toEqual(createdJoke);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newJoke);
    req.flush(createdJoke);
  });

  it('should update a joke', () => {
    const updatedJoke: Joke = {
      id: 1,
      joke: 'Updated Chuck Norris joke',
      created_at: new Date()
    };

    service.updateJoke(updatedJoke).subscribe(joke => {
      expect(joke).toEqual(updatedJoke);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedJoke);
    req.flush(updatedJoke);
  });

  it('should delete a joke', () => {
    const jokeId = 1;

    service.deleteJoke(jokeId).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${jokeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get joke by id', () => {
    const mockJoke: Joke = {
      id: 1,
      joke: 'Chuck Norris can divide by zero.',
      created_at: new Date()
    };

    service.getJokeById(1).subscribe(joke => {
      expect(joke).toEqual(mockJoke);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockJoke);
  });
});
