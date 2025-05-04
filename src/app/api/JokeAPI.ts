import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Joke} from '../models/Joke';

@Injectable({
  providedIn: 'root'
})

export class JokeAPI {
  #http = inject(HttpClient);
  #headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  #uri = '/getRandomJoke';
  #url = import.meta.env['NG_APP_API_URL'];

  getRandomJoke(){
    return this.#http.get(this.#url + this.#uri, {headers: this.#headers}) as Observable<Joke>;
  }
}
