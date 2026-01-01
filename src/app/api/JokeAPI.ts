import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Joke} from '../models/Joke';

@Injectable({
  providedIn: 'root'
})
export class JokeAPI {
  #http = inject(HttpClient);
  #baseUri = '/api/v1/jokes';

  private getApiUrl(): string {
    // Vérifier d'abord _NGX_ENV_ (utilisé en production et en test)
    const ngxEnv = (globalThis as any)._NGX_ENV_;
    if (ngxEnv?.['NG_APP_API_URL']) {
      return ngxEnv['NG_APP_API_URL'];
    }
    
    // Fallback sur import.meta.env (pas disponible en test Karma)
    try {
      return import.meta.env?.['NG_APP_API_URL'] || '';
    } catch {
      return '';
    }
  }

  getRandomJoke(): Observable<Joke> {
    return this.#http.get<Joke>(this.getApiUrl() + this.#baseUri + '/getRandomJoke');
  }

  getAllJokes(page: number = 0, size: number = 10): Observable<{jokes: Joke[], total: number}> {
    return this.#http.get<Joke[]>(this.getApiUrl() + this.#baseUri + `?page=${page}&size=${size}`, {
      observe: 'response'
    }).pipe(
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
    return this.#http.get<Joke>(this.getApiUrl() + this.#baseUri + '/' + id);
  }

  createJoke(joke: Joke): Observable<Joke> {
    return this.#http.post<Joke>(this.getApiUrl() + this.#baseUri, joke);
  }

  updateJoke(joke: Joke): Observable<Joke> {
    return this.#http.put<Joke>(this.getApiUrl() + this.#baseUri, joke);
  }

  deleteJoke(id: number): Observable<void> {
    return this.#http.delete<void>(this.getApiUrl() + this.#baseUri + '/' + id);
  }
}
