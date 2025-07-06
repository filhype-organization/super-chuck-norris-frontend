import {Component, inject} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
    NavbarComponent,
    RouterOutlet
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
