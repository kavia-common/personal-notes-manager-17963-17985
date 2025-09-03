import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { NotesService } from '../../core/notes.service';
import { Note } from '../../core/models';

@Component({
  standalone: true,
  selector: 'app-note-editor',
  imports: [FormsModule, NgFor],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notes = inject(NotesService);

  noteId = signal<string | null>(null);
  form = signal<Partial<Note>>({ title: '', content: '', categoryId: null });

  async ngOnInit() {
    await this.notes.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    this.noteId.set(id);
    if (id) {
      const n = await this.notes.get(id);
      this.form.set({ title: n.title, content: n.content, categoryId: n.categoryId ?? null });
    }
  }

  categories() {
    return this.notes.categories();
  }

  onTitleChange(val: string) {
    this.form.set({ ...this.form(), title: val });
  }

  onCategoryChange(val: string | null) {
    // Normalize empty string to null
    const normalized = (val === '' ? null : val);
    this.form.set({ ...this.form(), categoryId: normalized as any });
  }

  onContentChange(val: string) {
    this.form.set({ ...this.form(), content: val });
  }

  async save() {
    const data = this.form();
    if (this.noteId()) {
      await this.notes.update(this.noteId()!, data);
    } else {
      const created = await this.notes.create({
        title: data.title || '',
        content: data.content || '',
        categoryId: data.categoryId ?? null
      });
      this.noteId.set(created.id);
    }
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
