import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { NoteEditorComponent } from './notes/note-editor/note-editor.component';
import { AuthGuard } from './core/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Create account' },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: NotesListComponent, title: 'My Notes' },
      { path: 'note/new', component: NoteEditorComponent, title: 'New Note' },
      { path: 'note/:id', component: NoteEditorComponent, title: 'Edit Note' },
    ]
  },
  { path: '404', component: NotFoundComponent, title: 'Not Found' },
  { path: '**', redirectTo: '404' }
];
