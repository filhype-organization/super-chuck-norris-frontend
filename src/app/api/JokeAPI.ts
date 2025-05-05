import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Joke} from '../models/Joke';



interface AppConfig {
  API_URL?: string; 
}

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

@Injectable({
  providedIn: 'root'
})
export class JokeAPI {
  #http = inject(HttpClient);
  #headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  #uri = '/api/jokes/v1/getRandomJoke';
  #url = window.APP_CONFIG?.API_URL || '';

  getRandomJoke(){
    return this.#http.get(this.#url + this.#uri, {headers: this.#headers}) as Observable<Joke>;
  }
}
