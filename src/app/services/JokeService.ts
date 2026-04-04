import { computed, inject, Injectable, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JokeAPI } from '../api/JokeAPI';
import { Joke } from '../models/Joke';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JokeService {
  #jokeAPI = inject(JokeAPI);
  #destroyRef = inject(DestroyRef);
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

  getRandomJoke() {
    this.#loading.set(true);
    this.#error.set(null);
    this.#jokeAPI.getRandomJoke().pipe(
      tap((joke: Joke) => this.#randomJoke.set(joke)),
      catchError((error) => {
        console.error('Error getting random joke:', error);
        this.#error.set('Erreur lors du chargement de la blague');
        return of(null);
      }),
      finalize(() => this.#loading.set(false)),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe();
  }

  getAllJokes(page?: number, size?: number) {
    if (page !== undefined) this.#currentPage.set(page);
    if (size !== undefined) this.#pageSize.set(size);

    this.#loading.set(true);
    this.#error.set(null);

    this.#jokeAPI.getAllJokes(this.#currentPage(), this.#pageSize()).pipe(
      tap(({ jokes, total }) => {
        this.#jokes.set(jokes);
        this.#totalJokes.set(total);
      }),
      catchError((error) => {
        console.error('Error getting jokes:', error);
        this.#error.set('Erreur lors du chargement des blagues');
        return of({ jokes: [], total: 0 });
      }),
      finalize(() => this.#loading.set(false)),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe();
  }

  setPageSize(size: number) {
    this.#pageSize.set(size);
    this.#currentPage.set(0);
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
      tap(() => this.getAllJokes()),
      catchError((error) => {
        console.error('Error creating joke:', error);
        this.#error.set('Erreur lors de la création de la blague');
        return of(null);
      }),
      finalize(() => this.#loading.set(false)),
      takeUntilDestroyed(this.#destroyRef)
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
      }),
      catchError((error) => {
        console.error('Error updating joke:', error);
        this.#error.set('Erreur lors de la mise à jour de la blague');
        return of(null);
      }),
      finalize(() => this.#loading.set(false)),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe();
  }

  deleteJoke(id: number) {
    this.#loading.set(true);
    this.#error.set(null);
    this.#jokeAPI.deleteJoke(id).pipe(
      tap(() => this.getAllJokes()),
      catchError((error) => {
        console.error('Error deleting joke:', error);
        this.#error.set('Erreur lors de la suppression de la blague');
        return of(null);
      }),
      finalize(() => this.#loading.set(false)),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe();
  }
}
