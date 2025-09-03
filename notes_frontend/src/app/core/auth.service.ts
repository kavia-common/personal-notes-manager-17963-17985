import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { UserProfile } from './models';

/**
 * PUBLIC_INTERFACE
 * Auth service manages authentication state and token persistence.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'notes__token';
  private userKey = 'notes__user';

  user = signal<UserProfile | null>(this.readUser());
  isLoading = signal(false);

  constructor(private api: ApiService) {}

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private readUser(): UserProfile | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? JSON.parse(raw) as UserProfile : null;
    } catch {
      return null;
    }
  }

  private persist(token: string, user: UserProfile) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.user.set(user);
  }

  async login(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const res = await this.api.login(email, password);
      this.persist(res.token, res.user);
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(email: string, password: string, name?: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const res = await this.api.register(email, password, name);
      this.persist(res.token, res.user);
    } finally {
      this.isLoading.set(false);
    }
  }

  async refreshProfile(): Promise<void> {
    try {
      const me = await this.api.me();
      const token = this.getToken();
      if (token) this.persist(token, me);
    } catch {
      // ignore
    }
  }

  logout(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
