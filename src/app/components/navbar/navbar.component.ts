import { Component, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserRoleService } from '../../services/user-role.service';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private oidcSecurityService = inject(OidcSecurityService);
  private userRoleService = inject(UserRoleService);
  
  // Utiliser directement les observables du service
  isAdmin$ = this.userRoleService.isAdmin$();
  isAuthenticated$ = this.userRoleService.isAuthenticated$();
  userName$ = this.userRoleService.userName$();

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log('Logout result:', result));
  }
}
