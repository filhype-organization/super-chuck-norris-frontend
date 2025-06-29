import { Routes } from '@angular/router';
import {ChuckSearchComponent} from './components/chuck-search/chuck-search.component';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {path: '', component: ChuckSearchComponent, canActivate: [authGuard]},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'forbidden', component: UnauthorizedComponent},
  {path: '**', redirectTo: ''}
];
