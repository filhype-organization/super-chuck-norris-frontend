import {Component, inject, OnInit} from '@angular/core';
import {ChuckSearchComponent} from './components/chuck-search/chuck-search.component';
import {TitleComponent} from './components/title/title.component';
import {LoginResponse, OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ChuckSearchComponent,
    TitleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'front-chuck-norris';
  readonly #oidcSecurityService = inject(OidcSecurityService);


  ngOnInit() {
    this.#oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        console.log('Auth check response:', loginResponse);
        if (!loginResponse.isAuthenticated) {
          console.log('Not authenticated, starting authorization...');
          this.#oidcSecurityService.authorize();
        }
      });
  }

  logout() {
    this.#oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

}
