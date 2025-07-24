import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component';
import {authGuard} from './guards/auth.guard';
import {adminGuard} from './guards/admin.guard';
import { JokeAdminComponent } from './components/joke-admin/joke-admin.component';

export const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [authGuard]},
  {path: 'admin-joke', component: JokeAdminComponent, canActivate: [authGuard, adminGuard]},
  {path: 'admin-protected', component: AdminPanelComponent, canActivate: [authGuard]},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'forbidden', component: UnauthorizedComponent},
  {path: '**', redirectTo: ''}
];
