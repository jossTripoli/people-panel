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

  // testing the api routes
  constructor() {
    console.log('GET /users response:', this.users);
    console.log('GET /users/3 response:', this.usersApi.get('user-3'));


    const createResponse = this.usersApi.create({
      name: 'Test User',
      email: 'test@example.com',
      role: 'Viewer',
      status: 'Active',
    });

    console.log('POST /users response:', createResponse);

    console.log(
      'GET /users last page:',
      this.usersApi.list(100, 25),
    );

    console.log(
      'POST /users/user-1/password-reset response:',
      this.usersApi.resetPassword('user-1'),
    );
  }
}