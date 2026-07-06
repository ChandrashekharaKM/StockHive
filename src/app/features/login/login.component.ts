import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');

  async onLogin(event: Event) {
    event.preventDefault();
    try {
      await this.auth.login(this.email(), this.password());
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set(err.message);
    }
  }
}
