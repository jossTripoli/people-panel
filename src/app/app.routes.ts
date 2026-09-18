import { Routes } from '@angular/router';
import { User } from './user/user';
import { Dashboard } from './dashboard/dashboard';
import { Activity } from './activity/activity';


export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'users',
    component: User,
  },
  {
    path: 'activity',
    component: Activity,
  },
];
