import { Component } from '@angular/core';
import { ChuckSearchComponent } from '../chuck-search/chuck-search.component';

@Component({
  selector: 'app-home',
  template: `
    <app-chuck-search></app-chuck-search>
  `,
  imports: [ ChuckSearchComponent]
})
export class HomeComponent {
}
