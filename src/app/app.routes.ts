import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component';
import {adminGuard} from './guards/admin.guard';
import { JokeAdminComponent } from './components/joke-admin/joke-admin.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin-joke', component: JokeAdminComponent, canActivate: [adminGuard]},
  {path: 'admin-protected', component: AdminPanelComponent, canActivate: [adminGuard]},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'forbidden', component: UnauthorizedComponent},
  {path: '**', redirectTo: ''}
];
