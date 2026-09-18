import { Component, inject } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';
import { UsersApi } from '../features/users/users-api';

@Component({
  imports: [Breadcrumb],
  selector: 'app-user',
  templateUrl: './user.html',
})
export class User {
  // angular service injecting 
  private readonly usersApi = inject(UsersApi);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'User' },
  ];

  readonly users = this.usersApi.list();

  
}
