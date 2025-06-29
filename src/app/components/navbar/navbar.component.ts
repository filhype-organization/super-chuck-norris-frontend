import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);
  
  isAdmin$!: Observable<boolean>;
  isAuthenticated$!: Observable<boolean>;
  userName$!: Observable<string>;

  ngOnInit(): void {
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$.pipe(
      map(result => result.isAuthenticated)
    );
    
    this.userName$ = this.oidcSecurityService.userData$.pipe(
      map(userData => {
        if (!userData) return '';
        const data = userData as any;
        
        // Extraire les données utilisateur - nouvelle structure
        let actualUserData = data;
        if (data.userData) {
          actualUserData = data.userData;
        } else if (Array.isArray(data.allUserData) && data.allUserData.length > 0 && data.allUserData[0].userData) {
          actualUserData = data.allUserData[0].userData;
        }
        
        return actualUserData?.upn || actualUserData?.preferred_username || actualUserData?.name || actualUserData?.email || 'Utilisateur';
      })
    );

    this.isAdmin$ = this.oidcSecurityService.userData$.pipe(
      map(userData => {
        if (!userData) return false;
        
        // La structure semble être un objet avec userData directement accessible
        const data = userData as any;
        
        // Extraire les données utilisateur réelles
        let actualUserData = data;
        if (data.userData) {
          actualUserData = data.userData;
        } else if (Array.isArray(data.allUserData) && data.allUserData.length > 0 && data.allUserData[0].userData) {
          actualUserData = data.allUserData[0].userData;
        }
        
        // Vérifier directement dans les groupes (structure Keycloak la plus courante)
        if (actualUserData?.groups && Array.isArray(actualUserData.groups)) {
          if (actualUserData.groups.includes('admin')) {
            return true;
          }
        }
        
        // Différents emplacements possibles pour les rôles dans Keycloak
        const roleSources = [
          { name: 'role', data: actualUserData?.role },
          { name: 'roles', data: actualUserData?.roles },
          { name: 'groups', data: actualUserData?.groups },
          { name: 'realm_access.roles', data: actualUserData?.realm_access?.roles },
          { name: 'resource_access', data: actualUserData?.resource_access?.[actualUserData?.aud]?.roles },
          { name: 'resource_access.account', data: actualUserData?.resource_access?.account?.roles }
        ];
        
        for (const source of roleSources) {
          if (source.data) {
            if (Array.isArray(source.data) && source.data.includes('admin')) {
              return true;
            }
            if (typeof source.data === 'string' && source.data === 'admin') {
              return true;
            }
          }
        }
        
        return false;
      })
    );
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log('Logout result:', result));
  }
}
