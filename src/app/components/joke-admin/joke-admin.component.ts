import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JokeService } from '../../services/JokeService';
import { Joke } from '../../models/Joke';

@Component({
  selector: 'app-joke-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './joke-admin.component.html',
  styleUrl: './joke-admin.component.scss'
})
export class JokeAdminComponent implements OnInit {
  jokeService = inject(JokeService);
  
  showModal = signal(false);
  editingJoke = signal<Joke | null>(null);
  isEditing = signal(false);
  
  // Formulaire
  currentJoke = signal(new Joke());
  jokeText = signal('');

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
    if (!this.jokeText().trim()) {
      return;
    }

    // Mettre à jour la blague avec le texte du formulaire
    const joke = this.currentJoke();
    joke.joke = this.jokeText();

    if (this.isEditing()) {
      const editingJoke = this.editingJoke();
      if (editingJoke && editingJoke.id !== null) {
        this.jokeService.updateJoke(editingJoke.id, joke);
      }
    } else {
      this.jokeService.createJoke(joke);
    }
    
    this.closeModal();
  }

  deleteJoke(joke: Joke) {
    if (joke.id !== null && confirm(`Êtes-vous sûr de vouloir supprimer cette blague ?`)) {
      this.jokeService.deleteJoke(joke.id);
    }
  }

  updateJokeText(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.jokeText.set(target.value);
  }

  // Méthodes de pagination
  changePageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value);
    this.jokeService.setPageSize(size);
  }

  goToPage(page: number) {
    this.jokeService.goToPage(page);
  }

  goToNextPage() {
    this.jokeService.goToNextPage();
  }

  goToPreviousPage() {
    this.jokeService.goToPreviousPage();
  }

  getPageNumbers(): number[] {
    const totalPages = this.jokeService.totalPages();
    const currentPage = this.jokeService.currentPage();
    const pages: number[] = [];
    
    // Afficher au maximum 5 pages autour de la page courante
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Ajuster le début si on est près de la fin
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
