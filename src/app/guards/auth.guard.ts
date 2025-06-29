import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);
  
  return oidcSecurityService.checkAuth().pipe(
    tap((loginResponse) => {
      if (!loginResponse.isAuthenticated) {
        console.log('Not authenticated, redirecting to authorization...');
        oidcSecurityService.authorize();
      }
    }),
    map((loginResponse) => {
      return loginResponse.isAuthenticated;
    })
  );
};