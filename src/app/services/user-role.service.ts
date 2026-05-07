import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface UserInfo {
  userName: string;
  isAdmin: boolean;
  isAuthorized: boolean;
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
    isAuthorized: false,
    groups: [],
    isAuthenticated: false
  });

  public userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    combineLatest([
      this.oidcSecurityService.isAuthenticated$,
      this.oidcSecurityService.userData$
    ]).pipe(
      takeUntilDestroyed()
    ).subscribe(([authResult, userData]) => {
      const userInfo = this.extractUserInfo(userData, authResult.isAuthenticated);
      this.userInfoSubject.next(userInfo);
    });
  }

  private extractUserInfo(userData: any, isAuthenticated: boolean): UserInfo {
    if (!userData || !isAuthenticated) {
      return { userName: '', isAdmin: false, isAuthorized: false, groups: [], isAuthenticated: false };
    }

    let actualUserData = userData;
    if (userData.userData) {
      actualUserData = userData.userData;
    } else if (Array.isArray(userData.allUserData) && userData.allUserData.length > 0 && userData.allUserData[0].userData) {
      actualUserData = userData.allUserData[0].userData;
    }

    const userName = actualUserData?.upn ||
                    actualUserData?.preferred_username ||
                    actualUserData?.name ||
                    actualUserData?.email ||
                    'User';

    const groups = this.extractGroups(actualUserData);
    const isAdmin = this.checkAdminRole(actualUserData, groups);
    const isAuthorized = isAdmin || groups.includes('user');

    return { userName, isAdmin, isAuthorized, groups, isAuthenticated };
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
      if (Array.isArray(source)) return source;
    }
    return [];
  }

  private checkAdminRole(userData: any, groups: string[]): boolean {
    if (groups.includes('admin')) return true;

    const roleSources = [
      userData?.role,
      userData?.roles,
      userData?.realm_access?.roles,
      userData?.resource_access?.[userData?.aud]?.roles,
      userData?.resource_access?.account?.roles
    ];

    for (const source of roleSources) {
      if (Array.isArray(source) && source.includes('admin')) return true;
      if (typeof source === 'string' && source === 'admin') return true;
    }
    return false;
  }

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
