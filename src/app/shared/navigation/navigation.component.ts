import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  mobileOpen = false;
  private auth = inject(AuthService);
  user$ = this.auth.user$;
  private router = inject(Router);

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
