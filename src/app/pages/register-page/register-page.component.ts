import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router'; // ⬅️ HIER!

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
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

    this.auth.register(email, password).subscribe({
      next: () => this.router.navigateByUrl('/for-coaches'),
      error: (err) => console.error('Register failed', err),
    });
  }
}
