import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {JokeAPI} from '../api/JokeAPI';
import {Joke} from '../models/Joke';
import {catchError, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JokeService {
  #jokeAPI = inject(JokeAPI);
  #randomJoke = signal(new Joke());
  #jokes = signal<Joke[]>([]);
  #loading = signal(false);
  #error = signal<string | null>(null);
  #currentPage = signal(0);
  #pageSize = signal(10);
  #totalJokes = signal(0);
  
  randomJoke = computed(() => this.#randomJoke());
  jokes = computed(() => this.#jokes());
  loading = computed(() => this.#loading());
  error = computed(() => this.#error());
  currentPage = computed(() => this.#currentPage());
  pageSize = computed(() => this.#pageSize());
  totalJokes = computed(() => this.#totalJokes());
  totalPages = computed(() => Math.ceil(this.#totalJokes() / this.#pageSize()));
  hasPreviousPage = computed(() => this.#currentPage() > 0);
  hasNextPage = computed(() => this.#currentPage() < this.totalPages() - 1);

  getRandomJoke(){
    this.#loading.set(true);
    this.#error.set(null);
    this.#jokeAPI.getRandomJoke().pipe(
      tap((joke: Joke) => {
        this.#randomJoke.set(joke);
        this.#loading.set(false);
      }),
      catchError((error) => {
        console.error('Error getting random joke:', error);
        this.#error.set('Erreur lors du chargement de la blague');
        this.#loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  getAllJokes(page?: number, size?: number) {
    if (page !== undefined) this.#currentPage.set(page);
    if (size !== undefined) this.#pageSize.set(size);
    
    this.#loading.set(true);
    this.#error.set(null);
    
    // Récupérer les blagues avec le total dans le header
    this.#jokeAPI.getAllJokes(this.#currentPage(), this.#pageSize()).pipe(
      tap(({ jokes, total }) => {
        this.#jokes.set(jokes);
        this.#totalJokes.set(total);
        this.#loading.set(false);
      }),
      catchError((error) => {
        console.error('Error getting jokes:', error);
        this.#error.set('Erreur lors du chargement des blagues');
        this.#loading.set(false);
        return of({ jokes: [], total: 0 });
      })
    ).subscribe();
  }

  setPageSize(size: number) {
    this.#pageSize.set(size);
    this.#currentPage.set(0); // Reset to first page
    this.getAllJokes();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.getAllJokes(page);
    }
  }

  goToNextPage() {
    if (this.hasNextPage()) {
      this.goToPage(this.#currentPage() + 1);
    }
  }

  goToPreviousPage() {
    if (this.hasPreviousPage()) {
      this.goToPage(this.#currentPage() - 1);
    }
  }

  createJoke(joke: Joke) {
    this.#loading.set(true);
    this.#error.set(null);
    this.#jokeAPI.createJoke(joke).pipe(
      tap((newJoke: Joke) => {
        // Recharger la liste complète après création
        this.getAllJokes();
      }),
      catchError((error) => {
        console.error('Error creating joke:', error);
        this.#error.set('Erreur lors de la création de la blague');
        this.#loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  updateJoke(id: number, joke: Joke) {
    this.#loading.set(true);
    this.#error.set(null);
    this.#jokeAPI.updateJoke(joke).pipe(
      tap((updatedJoke: Joke) => {
        const currentJokes = this.#jokes();
        const index = currentJokes.findIndex(j => j.id === id);
        if (index !== -1) {
          const newJokes = [...currentJokes];
          newJokes[index] = updatedJoke;
          this.#jokes.set(newJokes);
        }
        this.#loading.set(false);
      }),
      catchError((error) => {
        console.error('Error updating joke:', error);
        this.#error.set('Erreur lors de la mise à jour de la blague');
        this.#loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  deleteJoke(id: number) {
    this.#loading.set(true);
    this.#error.set(null);
    this.#jokeAPI.deleteJoke(id).pipe(
      tap(() => {
        // Recharger la liste complète après suppression pour mettre à jour le total
        this.getAllJokes();
      }),
      catchError((error) => {
        console.error('Error deleting joke:', error);
        this.#error.set('Erreur lors de la suppression de la blague');
        this.#loading.set(false);
        return of(null);
      })
    ).subscribe();
  }
}
