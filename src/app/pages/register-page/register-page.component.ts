import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  loading = false;
  errorMsg = '';
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', Validators.required],
  });
  private router = inject(Router);

  onSubmit() {
    if (this.form.invalid) return;

    const {email, password, passwordConfirm} = this.form.value;
    if (!email || !password) return;

    if (password !== passwordConfirm) {
      this.errorMsg = 'Passwörter stimmen nicht überein.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.register(email, password).subscribe({
      next: () => this.router.navigateByUrl('/my/coach-profile'),
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.mapError(err.code);
      },
    });
  }

  private mapError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Diese E-Mail ist bereits registriert.';
      case 'auth/weak-password':
        return 'Passwort ist zu schwach (min. 6 Zeichen).';
      case 'auth/invalid-email':
        return 'Ungültige E-Mail-Adresse.';
      default:
        return 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
    }
  }
}
