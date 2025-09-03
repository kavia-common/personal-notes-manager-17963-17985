import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category, ID, Note, NoteQuery, UserProfile } from './models';
import { AuthService } from './auth.service';

/**
 * Low-level API service handling HTTP to the notes backend.
 * PUBLIC_INTERFACE
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.API_BASE_URL;
  private auth = inject(AuthService);

  private headers(json = true): Headers {
    const h = new Headers();
    if (json) h.set('Content-Type', 'application/json');
    const token = this.auth.getToken();
    if (token) h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  private async handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let detail: any;
      try { detail = await res.json(); } catch { /* noop */ }
      const message = detail?.message || detail?.error || res.statusText || 'Request failed';
      throw new Error(message);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : (undefined as unknown as T);
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${this.base}/auth/login`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ email, password })
    });
    return this.handle(res);
  }

  async register(email: string, password: string, name?: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${this.base}/auth/register`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ email, password, name })
    });
    return this.handle(res);
  }

  async me(): Promise<UserProfile> {
    const res = await fetch(`${this.base}/auth/me`, {
      headers: this.headers(false),
    });
    return this.handle(res);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${this.base}/categories`, { headers: this.headers(false) });
    return this.handle(res);
  }

  // Notes CRUD
  async queryNotes(query: NoteQuery): Promise<Note[]> {
    const params = new URLSearchParams();
    if (query.q) params.set('q', query.q);
    if (query.categoryId) params.set('categoryId', String(query.categoryId));
    if (query.archived != null) params.set('archived', String(query.archived));
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));
    const res = await fetch(`${this.base}/notes?${params.toString()}`, { headers: this.headers(false) });
    return this.handle(res);
  }

  async getNote(id: ID): Promise<Note> {
    const res = await fetch(`${this.base}/notes/${id}`, { headers: this.headers(false) });
    return this.handle(res);
  }

  async createNote(payload: Partial<Note>): Promise<Note> {
    const res = await fetch(`${this.base}/notes`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload)
    });
    return this.handle(res);
  }

  async updateNote(id: ID, payload: Partial<Note>): Promise<Note> {
    const res = await fetch(`${this.base}/notes/${id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(payload)
    });
    return this.handle(res);
  }

  async deleteNote(id: ID): Promise<void> {
    const res = await fetch(`${this.base}/notes/${id}`, {
      method: 'DELETE',
      headers: this.headers(false)
    });
    await this.handle(res);
  }
}
