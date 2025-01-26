import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
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

  getRandomJoke(){
    return this.#http.get(environment.apiURL + this.#uri, {headers: this.#headers}) as Observable<Joke>;
  }
}
