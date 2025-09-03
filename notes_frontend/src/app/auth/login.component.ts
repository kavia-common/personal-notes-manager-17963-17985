import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './auth.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal<string>('');
  password = signal<string>('');
  error = signal<string | null>(null);

  async submit() {
    this.error.set(null);
    try {
      await this.auth.login(this.email(), this.password());
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(e?.message || 'Login failed');
    }
  }
}
