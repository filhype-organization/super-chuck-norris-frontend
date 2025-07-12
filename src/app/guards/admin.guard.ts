import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleService } from '../services/user-role.service';
import { map, tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const userRoleService = inject(UserRoleService);
  const router = inject(Router);
  
  return userRoleService.userInfo$.pipe(
    tap((userInfo) => {
      
      if (!userInfo.isAuthenticated) {
        router.navigate(['/unauthorized']);
      } else if (!userInfo.isAdmin) {
        router.navigate(['/unauthorized']);
      }
    }),
    map((userInfo) => {
      return userInfo.isAuthenticated && userInfo.isAdmin;
    })
  );
};
