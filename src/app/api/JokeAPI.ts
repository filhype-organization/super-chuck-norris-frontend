import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Joke} from '../models/Joke';

@Injectable({
  providedIn: 'root'
})
export class JokeAPI {
  #http = inject(HttpClient);
  #uri = '/api/jokes/v1/getRandomJoke';
  #url = import.meta.env['NG_APP_API_URL'] || '';

  getRandomJoke(): Observable<Joke> {
    return this.#http.get<Joke>(this.#url + this.#uri);
  }

}
