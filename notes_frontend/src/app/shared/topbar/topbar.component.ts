import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../core/notes.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  private notes = inject(NotesService);
  private auth = inject(AuthService);
  private router = inject(Router);

  q = signal('');

  constructor() {
    effect(() => {
      const current = this.notes.query().q || '';
      if (current !== this.q()) this.q.set(current);
    });
  }

  onQueryChange(val: string) {
    this.q.set(val);
    // Debounce could be added; for now trigger search immediately
    this.notes.search({ q: val });
  }

  newNote() {
    this.router.navigateByUrl('/note/new');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  userEmail(): string {
    return this.auth.user()?.email || '';
  }
}
