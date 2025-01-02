import {Component} from '@angular/core';
import {ChuckSearchComponent} from './components/chuck-search/chuck-search.component';
import {TitleComponent} from './components/title/title.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChuckSearchComponent, TitleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-chuck-norris';
}
