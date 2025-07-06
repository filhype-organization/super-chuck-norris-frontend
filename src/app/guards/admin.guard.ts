import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleService } from '../services/user-role.service';
import { map, tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const userRoleService = inject(UserRoleService);
  const router = inject(Router);
  
  console.log('AdminGuard - Checking admin access for route:', state.url);
  
  return userRoleService.userInfo$.pipe(
    tap((userInfo) => {
      console.log('AdminGuard - User info:', userInfo);
      
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
