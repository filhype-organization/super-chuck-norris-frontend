import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

export interface UserInfo {
  userName: string;
  isAdmin: boolean;
  groups: string[];
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private oidcSecurityService = inject(OidcSecurityService);
  
  private userInfoSubject = new BehaviorSubject<UserInfo>({
    userName: '',
    isAdmin: false,
    groups: [],
    isAuthenticated: false
  });

  public userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    this.initializeUserInfo();
  }

  private initializeUserInfo(): void {
    // Combiner les données d'authentification et userData
    this.oidcSecurityService.isAuthenticated$.pipe(
      tap(() => {
        // Quand le statut d'authentification change, mettre à jour les infos utilisateur
        this.updateUserInfo();
      })
    ).subscribe();

    // Écouter les changements de données utilisateur
    this.oidcSecurityService.userData$.pipe(
      tap(() => {
        this.updateUserInfo();
      })
    ).subscribe();
  }

  private updateUserInfo(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(authResult => {
      const isAuthenticated = authResult.isAuthenticated;
      
      this.oidcSecurityService.userData$.subscribe(userData => {
        const userInfo = this.extractUserInfo(userData, isAuthenticated);
        this.userInfoSubject.next(userInfo);
      });
    });
  }

  private extractUserInfo(userData: any, isAuthenticated: boolean): UserInfo {
    if (!userData || !isAuthenticated) {
      console.log('UserRoleService - No userData or not authenticated, returning default');
      return {
        userName: '',
        isAdmin: false,
        groups: [],
        isAuthenticated: false
      };
    }

    // Extraire les données utilisateur selon la structure OIDC
    let actualUserData = userData;
    if (userData.userData) {
      actualUserData = userData.userData;
    } else if (Array.isArray(userData.allUserData) && userData.allUserData.length > 0 && userData.allUserData[0].userData) {
      actualUserData = userData.allUserData[0].userData;
      console.log('UserRoleService - Using allUserData[0].userData structure:', actualUserData);
    }

    // Extraire le nom d'utilisateur
    const userName = actualUserData?.upn || 
                    actualUserData?.preferred_username || 
                    actualUserData?.name || 
                    actualUserData?.email || 
                    'Utilisateur';

    // Extraire les groupes/rôles
    const groups = this.extractGroups(actualUserData);
    const isAdmin = this.checkAdminRole(actualUserData, groups);

    return {
      userName,
      isAdmin,
      groups,
      isAuthenticated
    };
  }

  private extractGroups(userData: any): string[] {
    const possibleGroupSources = [
      userData?.groups,
      userData?.roles,
      userData?.realm_access?.roles,
      userData?.resource_access?.[userData?.aud]?.roles,
      userData?.resource_access?.account?.roles
    ];

    for (const source of possibleGroupSources) {
      if (Array.isArray(source)) {
        return source;
      }
    }

    return [];
  }

  private checkAdminRole(userData: any, groups: string[]): boolean {
    // Vérifier dans les groupes extraits
    if (groups.includes('admin')) {
      return true;
    }

    // Vérifier d'autres sources possibles pour le rôle admin
    const roleSources = [
      userData?.role,
      userData?.roles,
      userData?.realm_access?.roles,
      userData?.resource_access?.[userData?.aud]?.roles,
      userData?.resource_access?.account?.roles
    ];

    for (const source of roleSources) {
      if (Array.isArray(source) && source.includes('admin')) {
        return true;
      }
      if (typeof source === 'string' && source === 'admin') {
        return true;
      }
    }

    return false;
  }

  // Méthodes utilitaires pour faciliter l'utilisation
  public isAdmin$(): Observable<boolean> {
    return this.userInfo$.pipe(map(info => info.isAdmin));
  }

  public userName$(): Observable<string> {
    return this.userInfo$.pipe(map(info => info.userName));
  }

  public isAuthenticated$(): Observable<boolean> {
    return this.userInfo$.pipe(map(info => info.isAuthenticated));
  }

  public groups$(): Observable<string[]> {
    return this.userInfo$.pipe(map(info => info.groups));
  }

  public hasRole(role: string): Observable<boolean> {
    return this.userInfo$.pipe(map(info => info.groups.includes(role)));
  }

  // Méthodes synchrones pour utilisation dans les guards
  public getCurrentUserInfo(): UserInfo {
    return this.userInfoSubject.value;
  }

  public isCurrentUserAdmin(): boolean {
    return this.userInfoSubject.value.isAdmin;
  }

  public isCurrentUserAuthenticated(): boolean {
    return this.userInfoSubject.value.isAuthenticated;
  }
}
