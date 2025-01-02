import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {JokeAPI} from '../api/JokeAPI';
import {Joke} from '../models/Joke';
import {catchError, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JokeService {
  #jokeAPI = inject(JokeAPI);
  #randomJoke = signal(new Joke());
  randomJoke = computed(() => this.#randomJoke());

  getRandomJoke(){
    this.#jokeAPI.getRandomJoke().pipe(
      tap((joke: Joke) => {
        this.#randomJoke.set(joke)
      }),
      catchError((error) => {
        console.error(error);
        return error;
      })
    ).subscribe();
  }
}
