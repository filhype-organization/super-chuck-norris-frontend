import {Component, inject} from '@angular/core';
import {JokeService} from '../../service/JokeService';

@Component({
    selector: 'app-chuck-search',
    imports: [],
    templateUrl: './chuck-search.component.html',
    styleUrl: './chuck-search.component.scss'
})
export class ChuckSearchComponent {
  protected jokeService = inject(JokeService);

}
