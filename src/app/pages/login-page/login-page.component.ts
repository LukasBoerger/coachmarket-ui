import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loading = false;
  errorMsg = '';
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  private router = inject(Router);

  onSubmit() {
    if (this.form.invalid) return;
    const {email, password} = this.form.value;
    if (!email || !password) return;

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/my/coach-profile'),
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.mapError(err.code);
      },
    });
  }

  private mapError(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Kein Konto mit dieser E-Mail gefunden.';
      case 'auth/wrong-password':
        return 'Falsches Passwort.';
      case 'auth/invalid-credential':
        return 'E-Mail oder Passwort falsch.';
      case 'auth/too-many-requests':
        return 'Zu viele Versuche. Bitte warte kurz.';
      default:
        return 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.';
    }
  }
}
