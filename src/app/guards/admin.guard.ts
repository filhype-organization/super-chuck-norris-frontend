import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleService } from '../services/user-role.service';
import { map, first } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const userRoleService = inject(UserRoleService);
  const router = inject(Router);

  return userRoleService.userInfo$.pipe(
    first(),
    map((userInfo) => {
      if (!userInfo.isAuthenticated || !userInfo.isAdmin) {
        router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    })
  );
};
