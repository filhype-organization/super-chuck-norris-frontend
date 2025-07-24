# Service de Gestion des Rôles Utilisateur - UserRoleService

## Vue d'ensemble

Le `UserRoleService` est un service Angular centralisé qui gère les informations utilisateur et les rôles provenant de l'authentification OIDC. Il permet d'accéder facilement aux données utilisateur dans toute l'application.

## Fonctionnalités

- **Gestion centralisée** des rôles et informations utilisateur
- **Observables réactifs** pour les mises à jour en temps réel
- **Support des structures Keycloak** diverses pour les rôles et groupes
- **Méthodes utilitaires** pour faciliter l'utilisation
- **Compatible avec les guards** pour la protection des routes

## Utilisation

### Dans un composant

```typescript
import { Component, inject } from '@angular/core';
import { UserRoleService } from '../../services/user-role.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-my-component',
  template: `
    @if (userRoleService.isAdmin$() | async) {
      <p>Contenu admin</p>
    }
    
    <p>Utilisateur: {{ userRoleService.userName$() | async }}</p>
    
    @if (userRoleService.hasRole('moderator') | async) {
      <p>Contenu modérateur</p>
    }
  `,
  imports: [AsyncPipe]
})
export class MyComponent {
  protected userRoleService = inject(UserRoleService);
}
```

### Dans un guard

```typescript
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserRoleService } from '../services/user-role.service';
import { map } from 'rxjs';

export const moderatorGuard: CanActivateFn = (route, state) => {
  const userRoleService = inject(UserRoleService);
  
  return userRoleService.hasRole('moderator');
};
```

### Dans un service

```typescript
import { Injectable, inject } from '@angular/core';
import { UserRoleService } from './user-role.service';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private userRoleService = inject(UserRoleService);
  
  doSomething() {
    const userInfo = this.userRoleService.getCurrentUserInfo();
    
    if (userInfo.isAdmin) {
      // Logique admin
    }
  }
}
```

## API

### Observables

- `userInfo$: Observable<UserInfo>` - Informations complètes de l'utilisateur
- `isAdmin$(): Observable<boolean>` - Vérifie si l'utilisateur est admin
- `userName$(): Observable<string>` - Nom d'utilisateur
- `isAuthenticated$(): Observable<boolean>` - Statut d'authentification
- `groups$(): Observable<string[]>` - Liste des groupes/rôles
- `hasRole(role: string): Observable<boolean>` - Vérifie un rôle spécifique

### Méthodes synchrones

- `getCurrentUserInfo(): UserInfo` - Informations actuelles (utile pour les guards)
- `isCurrentUserAdmin(): boolean` - Vérifie si l'utilisateur actuel est admin
- `isCurrentUserAuthenticated(): boolean` - Vérifie l'authentification actuelle

### Interface UserInfo

```typescript
interface UserInfo {
  userName: string;
  isAdmin: boolean;
  groups: string[];
  isAuthenticated: boolean;
}
```

## Structure des rôles supportée

Le service détecte automatiquement les rôles dans différentes structures Keycloak :

- `userData.groups` (le plus courant)
- `userData.roles`
- `userData.realm_access.roles`
- `userData.resource_access[clientId].roles`
- `userData.role` (rôle unique)

## Avantages

1. **Centralisation** : Une seule source de vérité pour les rôles
2. **Réactivité** : Mises à jour automatiques lors des changements
3. **Simplicité** : API simple et intuitive
4. **Performance** : Évite la duplication de logique
5. **Maintenabilité** : Code plus propre et organisé
6. **Sécurité** : Gestion cohérente des autorisations

## Exemple complet - Guards

```typescript
// auth.guard.ts - Protection basique
export const authGuard: CanActivateFn = (route, state) => {
  const userRoleService = inject(UserRoleService);
  return userRoleService.isAuthenticated$();
};

// admin.guard.ts - Protection admin
export const adminGuard: CanActivateFn = (route, state) => {
  const userRoleService = inject(UserRoleService);
  return userRoleService.isAdmin$();
};

// Routes
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
  { path: 'user', component: UserComponent, canActivate: [authGuard] }
];
```

Ce service simplifie grandement la gestion des rôles et permet d'avoir une approche cohérente dans toute l'application.
