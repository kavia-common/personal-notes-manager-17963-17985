import { Component, computed, inject } from '@angular/core';
import { NgFor, DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NotesService } from '../../core/notes.service';
import { Note } from '../../core/models';

@Component({
  standalone: true,
  selector: 'app-notes-list',
  imports: [NgFor, DatePipe, NgIf],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  private notesSvc = inject(NotesService);
  private router = inject(Router);

  notes = computed<Note[]>(() => this.notesSvc.notes());

  trackById = (_: number, n: Note) => n.id;

  edit(note: Note) {
    this.router.navigate(['/note', note.id]);
  }

  async remove(note: Note) {
    const ok = confirm('Delete this note? This cannot be undone.');
    if (ok) {
      await this.notesSvc.remove(note.id);
    }
  }

  async toggleArchive(note: Note) {
    await this.notesSvc.update(note.id, { archived: !note.archived });
  }
}
