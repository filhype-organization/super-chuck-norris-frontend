import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, tap, first } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.isAuthenticated$.pipe(
    first(),
    tap((authResult) => {
      if (!authResult.isAuthenticated) {
        oidcSecurityService.authorize();
      }
    }),
    map((authResult) => authResult.isAuthenticated)
  );
};
