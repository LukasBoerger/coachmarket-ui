import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router'; // ⬅️ HIER!

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    email: [''],
    password: [''],
  });

  onSubmit() {
    const {email, password} = this.form.value;
    if (!email || !password) return;

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/for-coaches'),
      error: (err) => console.error('Login failed', err),
    });
  }
}
