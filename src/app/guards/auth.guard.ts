import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, tap } from 'rxjs';
import { UserRoleService } from '../services/user-role.service';

export const authGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const userRoleService = inject(UserRoleService);
  
  return oidcSecurityService.checkAuth().pipe(
    tap((loginResponse) => {
      if (!loginResponse.isAuthenticated) {
        oidcSecurityService.authorize();
      }
    }),
    map((loginResponse) => {
      return loginResponse.isAuthenticated;
    })
  );
};