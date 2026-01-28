import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationComponent} from './shared/navigation/navigation.component';
import {FooterComponent} from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
