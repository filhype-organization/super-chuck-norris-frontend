import {Component, inject} from '@angular/core';
import {ChuckSearchComponent} from './components/chuck-search/chuck-search.component';
import {TitleComponent} from './components/title/title.component';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
    selector: 'app-root',
    imports: [
    ChuckSearchComponent,
    TitleComponent,
    NavbarComponent
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-chuck-norris';
  readonly #oidcSecurityService = inject(OidcSecurityService);

  logout() {
    this.#oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }
}
