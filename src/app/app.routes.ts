import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Dashboard } from './dashboard/dashboard';
import { Activity } from './activity/activity';


export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'users',
    component: Users,
  },
  {
    path: 'activity',
    component: Activity,
  },
];
