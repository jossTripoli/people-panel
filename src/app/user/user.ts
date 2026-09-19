import { Component, inject } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';
import { UsersApi } from '../features/users/users-api';
import { ApiError } from '../features/users/api-response';

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

    // Test updating a user

    // get user 1 before update
    const original = this.usersApi.get('user-1');
    console.log('GET /users/user-1 response:', original);

    // update user 1 
    const updateResponse = this.usersApi.update(
      'user-1',
      {
        name: 'Updated Yipee',
        email: 'updated@example.com',
        role: 'Admin',
        status: 'Active',
      },
      original.headers['ETag'],
    );

    // show result of update
    console.log('PUT /users/user-1 response:', updateResponse);

    console.log(
      'GET /users/user-1 after update:',
      this.usersApi.get('user-1'),
    );

    // testing stale ETAG
    try {
      this.usersApi.update(
        'user-1',
        {
          name: 'Another update',
          email: 'another@example.com',
          role: 'Viewer',
          status: 'Invited',
        },
        original.headers['ETag'],
      );
    } catch (error) {
      if (error instanceof ApiError) {
        console.log('PUT /users/user-1 stale ETag error:', {
          status: error.status,
          message: error.message,
        });
      }
    }

  }
}