import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserRoleService } from '../services/user-role.service';
import { combineLatest, map, first } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const userRoleService = inject(UserRoleService);
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return combineLatest([
    oidcSecurityService.isAuthenticated$,
    userRoleService.userInfo$
  ]).pipe(
    first(),
    map(([authResult, userInfo]) => {
      if (!authResult.isAuthenticated) {
        oidcSecurityService.authorize();
        return false;
      }
      if (!userInfo.isAuthorized) {
        router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    })
  );
};
