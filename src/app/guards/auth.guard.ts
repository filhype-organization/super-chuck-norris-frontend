import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.checkAuth().pipe(
    tap((loginResponse) => {
      if (!loginResponse.isAuthenticated) {
        oidcSecurityService.authorize();
      }
    }),
    map((loginResponse) => loginResponse.isAuthenticated)
  );
};
