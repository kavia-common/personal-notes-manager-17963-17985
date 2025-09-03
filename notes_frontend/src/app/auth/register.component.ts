import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './auth.css'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  error = signal<string | null>(null);

  async submit() {
    this.error.set(null);
    try {
      await this.auth.register(this.email(), this.password(), this.name());
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(e?.message || 'Registration failed');
    }
  }
}
