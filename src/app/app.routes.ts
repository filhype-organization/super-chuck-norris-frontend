import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component';
import {authGuard} from './guards/auth.guard';
import {adminGuard} from './guards/admin.guard';

export const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [authGuard]},
  {path: 'admin', component: AdminPanelComponent, canActivate: [authGuard]}, // Temporairement sans adminGuard pour debug
  {path: 'admin-protected', component: AdminPanelComponent, canActivate: [authGuard, adminGuard]}, // Version avec protection complète
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'forbidden', component: UnauthorizedComponent},
  {path: '**', redirectTo: ''}
];
