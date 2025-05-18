import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {Joke} from '../models/Joke';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class JokeAPI {
  #http = inject(HttpClient);
  #oidcSecurityService = inject(OidcSecurityService);
  #baseHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  #uri = '/api/jokes/v1/getRandomJoke';
  #url = import.meta.env['NG_APP_API_URL'] || '';

  getRandomJoke(): Observable<Joke> {
    return this.#oidcSecurityService.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          ...this.#baseHeaders,
          'Authorization': `Bearer ${token}`
        });

        return this.#http.get<Joke>(this.#url + this.#uri, {headers});
      })
    );
  }
}
