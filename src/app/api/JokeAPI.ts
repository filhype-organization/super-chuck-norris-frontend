import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Joke} from '../models/Joke';

@Injectable({
  providedIn: 'root'
})
export class JokeAPI {
  #http = inject(HttpClient);
  #baseUri = '/api/v1/jokes';
  #url = import.meta.env['NG_APP_API_URL'] || '';

  getRandomJoke(): Observable<Joke> {
    return this.#http.get<Joke>(this.#url + this.#baseUri + '/getRandomJoke');
  }

  getAllJokes(page: number = 0, size: number = 10): Observable<{jokes: Joke[], total: number}> {
    return this.#http.get<Joke[]>(this.#url + this.#baseUri + `?page=${page}&size=${size}`, {
      observe: 'response'
    }).pipe(
      tap(response => {
        // Exposer le header X-Total-Count pour le CORS
        const totalCount = response.headers.get('X-Total-Count');
        console.log('Headers:', response.headers);
        console.log('Total jokes count:', totalCount);
      }),
      map((response: HttpResponse<Joke[]>) => ({
        jokes: response.body || [],
        total: parseInt(response.headers.get('X-Total-Count') || '0', 10)
      }))
    );
  }

  getTotalJokesCount(): Observable<number> {
    // Plus besoin de cette méthode, mais on la garde pour compatibilité
    return this.getAllJokes(0, 1).pipe(
      map(result => result.total)
    );
  }

  getJokeById(id: number): Observable<Joke> {
    return this.#http.get<Joke>(this.#url + this.#baseUri + '/' + id);
  }

  createJoke(joke: Joke): Observable<Joke> {
    return this.#http.post<Joke>(this.#url + this.#baseUri, joke);
  }

  updateJoke(joke: Joke): Observable<Joke> {
    return this.#http.put<Joke>(this.#url + this.#baseUri, joke);
  }

  deleteJoke(id: number): Observable<void> {
    return this.#http.delete<void>(this.#url + this.#baseUri + '/' + id);
  }
}
