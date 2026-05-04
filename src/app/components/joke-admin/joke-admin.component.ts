import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JokeService } from '../../services/JokeService';
import { Joke } from '../../models/Joke';

@Component({
  selector: 'app-joke-admin',
  imports: [DatePipe, FormsModule],
  templateUrl: './joke-admin.component.html',
  styleUrl: './joke-admin.component.scss'
})
export class JokeAdminComponent implements OnInit {
  protected jokeService = inject(JokeService);

  showModal = signal(false);
  editingJoke = signal<Joke | null>(null);
  isEditing = signal(false);
  currentJoke = signal(new Joke());
  jokeText = signal('');
  filterText = signal('');
  jokeToDelete = signal<Joke | null>(null);
  successMessage = signal<string | null>(null);

  readonly maxChars = 500;

  charCount = computed(() => this.jokeText().length);

  filteredJokes = computed(() => {
    const filter = this.filterText().toLowerCase().trim();
    if (!filter) return this.jokeService.jokes();
    return this.jokeService.jokes().filter(j =>
      j.joke.toLowerCase().includes(filter)
    );
  });

  ngOnInit() {
    this.jokeService.getAllJokes();
  }

  openAddModal() {
    this.currentJoke.set(new Joke());
    this.jokeText.set('');
    this.editingJoke.set(null);
    this.isEditing.set(false);
    this.showModal.set(true);
  }

  openEditModal(joke: Joke) {
    this.currentJoke.set({ ...joke });
    this.jokeText.set(joke.joke);
    this.editingJoke.set(joke);
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingJoke.set(null);
    this.isEditing.set(false);
    this.currentJoke.set(new Joke());
    this.jokeText.set('');
  }

  saveJoke() {
    if (!this.jokeText().trim() || this.charCount() > this.maxChars) return;

    const joke = { ...this.currentJoke(), joke: this.jokeText().trim() };

    if (this.isEditing()) {
      const editingJoke = this.editingJoke();
      if (editingJoke?.id !== null && editingJoke?.id !== undefined) {
        this.jokeService.updateJoke(editingJoke.id, joke);
        this.showToast('Blague modifiée avec succès !');
      }
    } else {
      this.jokeService.createJoke(joke);
      this.showToast('Blague ajoutée avec succès !');
    }

    this.closeModal();
  }

  requestDelete(joke: Joke) {
    this.jokeToDelete.set(joke);
  }

  confirmDelete() {
    const joke = this.jokeToDelete();
    if (joke?.id !== null && joke?.id !== undefined) {
      this.jokeService.deleteJoke(joke.id);
      this.showToast('Blague supprimée avec succès !');
    }
    this.jokeToDelete.set(null);
  }

  cancelDelete() {
    this.jokeToDelete.set(null);
  }

  clearFilter() {
    this.filterText.set('');
  }

  private showToast(message: string) {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3500);
  }

  updateJokeText(event: Event) {
    this.jokeText.set((event.target as HTMLTextAreaElement).value);
  }

  updateFilterText(event: Event) {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  changePageSize(event: Event) {
    this.jokeService.setPageSize(parseInt((event.target as HTMLSelectElement).value, 10));
  }

  goToPage(page: number) { this.jokeService.goToPage(page); }
  goToNextPage() { this.jokeService.goToNextPage(); }
  goToPreviousPage() { this.jokeService.goToPreviousPage(); }

  getPageNumbers(): number[] {
    const totalPages = this.jokeService.totalPages();
    const currentPage = this.jokeService.currentPage();
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
