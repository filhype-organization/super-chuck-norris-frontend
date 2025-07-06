import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { ChuckSearchComponent } from '../chuck-search/chuck-search.component';

@Component({
  selector: 'app-home',
  template: `
    <app-title></app-title>
    <app-chuck-search></app-chuck-search>
  `,
  imports: [TitleComponent, ChuckSearchComponent]
})
export class HomeComponent {
}
