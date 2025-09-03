import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { NotesService } from '../../core/notes.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  private notes = inject(NotesService);

  ngOnInit(): void {
    this.notes.loadCategories();
    // Trigger initial search only once at startup
    this.notes.search({});
  }

  activeCategoryId() {
    return this.notes.query().categoryId || null;
  }

  isArchived() {
    return !!this.notes.query().archived;
  }

  selectAll() {
    this.notes.search({ categoryId: null, archived: false });
  }

  selectArchived() {
    this.notes.search({ archived: true });
  }

  selectCategory(id: string) {
    this.notes.search({ categoryId: id, archived: false });
  }

  categories() {
    return this.notes.categories();
  }
}
