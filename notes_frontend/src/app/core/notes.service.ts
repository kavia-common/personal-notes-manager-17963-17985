import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Category, ID, Note, NoteQuery } from './models';

/**
 * PUBLIC_INTERFACE
 * Coordinates fetching and caching notes and categories.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  notes = signal<Note[]>([]);
  categories = signal<Category[]>([]);
  query = signal<NoteQuery>({ q: '', categoryId: null, archived: false, page: 1, pageSize: 50 });
  isLoading = signal(false);

  constructor(private api: ApiService) {}

  async loadCategories() {
    const cats = await this.api.getCategories();
    this.categories.set(cats);
  }

  async search(partial?: Partial<NoteQuery>) {
    this.isLoading.set(true);
    try {
      if (partial) this.query.set({ ...this.query(), ...partial });
      const list = await this.api.queryNotes(this.query());
      this.notes.set(list);
    } finally {
      this.isLoading.set(false);
    }
  }

  async create(note: Partial<Note>): Promise<Note> {
    const created = await this.api.createNote(note);
    this.notes.set([created, ...this.notes()]);
    return created;
  }

  async update(id: ID, patch: Partial<Note>): Promise<Note> {
    const updated = await this.api.updateNote(id, patch);
    this.notes.set(this.notes().map(n => (n.id === id ? updated : n)));
    return updated;
  }

  async remove(id: ID): Promise<void> {
    await this.api.deleteNote(id);
    this.notes.set(this.notes().filter(n => n.id !== id));
  }

  async get(id: ID): Promise<Note> {
    return this.api.getNote(id);
  }
}
