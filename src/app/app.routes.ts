import { Routes } from '@angular/router';
import {ChuckSearchComponent} from './components/chuck-search/chuck-search.component';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';

export const routes: Routes = [
  {path: '', component: ChuckSearchComponent},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'forbidden', component: UnauthorizedComponent},
  {path: '**', redirectTo: ''}
];
