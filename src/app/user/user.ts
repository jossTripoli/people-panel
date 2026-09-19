import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';
import { UsersApi } from '../features/users/users-api';
import { ApiError } from '../features/users/api-response';
import { FormsModule } from '@angular/forms';
import { CreateUserRequest, UserModel } from '../models/user';

@Component({
  imports: [Breadcrumb, FormsModule],
  selector: 'app-user',
  templateUrl: './user.html',
})
export class User {
  // angular service injecting 
  private readonly usersApi = inject(UsersApi);
  private readonly changeDetector = inject(ChangeDetectorRef);
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'User' },
  ];

  // Start at the first user
  skip = 0;
  // Show default of 25 users per page
  limit = 25;
  // Load current page of users from the API
  users = this.usersApi.list(this.skip, this.limit);

  // Current page number, starting at 1.
  get currentPage() {
    return Math.floor(this.skip / this.limit) + 1;
  }

  // Total number of pages based on the API total.
  get totalPages() {
    return Math.ceil(this.users.body.total / this.limit);
  }

  previousPage() {
    // Move back one page, but never let skip go below 0
    this.skip = Math.max(0, this.skip - this.limit);
    // Reload the users for the new page
    this.users = this.usersApi.list(this.skip, this.limit);
  }

  nextPage() {
    // Only move forward if there are more users after this page
    if (this.skip + this.limit < this.users.body.total) {
      this.skip += this.limit;
      // Reload the users for the new page
      this.users = this.usersApi.list(this.skip, this.limit);
    }
  }

  firstPage() {
    this.skip = 0;
    this.users = this.usersApi.list(this.skip, this.limit);
  }

  lastPage() {
    this.skip = (this.totalPages - 1) * this.limit;
    this.users = this.usersApi.list(this.skip, this.limit);
  }

  changePageLimit() {
    this.skip = 0;
    this.users = this.usersApi.list(this.skip, this.limit);
  }

  // showing # of users message
  get firstUserNumber() {
    return this.users.body.total === 0 ? 0 : this.skip + 1;
  }

  get lastUserNumber() {
    return Math.min(this.skip + this.limit, this.users.body.total);
  }

  // to control wether the creation form is shown
  isCreating = false;

  // creates the newUser class which defines the data model reflected in the form.
  newUser: CreateUserRequest = {
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active',
  };

  message = '';
  messageType: 'success' | 'error' = 'success';
  isCreatingUser = false;

  createUser() {
    try {
      const response = this.usersApi.create(this.newUser);

      this.message = `${response.body.name} was created successfully.`;
      this.messageType = 'success';

      const totalUsers = this.usersApi.list(0, this.limit).body.total;

      this.skip = Math.floor((totalUsers - 1) / this.limit) * this.limit;
      this.users = this.usersApi.list(this.skip, this.limit);

      this.newUser = {
        name: '',
        email: '',
        role: 'Viewer',
        status: 'Active',
      };

      this.isCreating = false;
    } catch (error) {
      this.messageType = 'error';

      if (error instanceof ApiError) {
        this.message = error.message;
      } else {
        this.message = 'Something went wrong while creating the user.';
      }
    }
  }

  selectedUser: UserModel | null = null;
  selectedUserETag = '';
  isLoadingUser = false;

  viewUser(id: string) {
    // Open the sidebar immediately before the user data loads and use skeleton placeholders
    this.selectedUser = null;
    this.selectedUserETag = '';
    this.isLoadingUser = true;

    setTimeout(() => {
      try {
        const response = this.usersApi.get(id);

        this.selectedUser = response.body;
        this.selectedUserETag = response.headers['ETag'];

        // console.log(`GET /users/${id} response:`, response);
      } catch (error) {
        this.messageType = 'error';

        if (error instanceof ApiError) {
          this.message = error.message;
        } else {
          this.message = 'Something went wrong while loading the user.';
        }
      } finally {
        this.isLoadingUser = false;

        // Tell Angular to render the loaded user after the simulated delay.
        this.changeDetector.markForCheck();
      }
    }, 500);
  }
  // testing the api routes
  // constructor() {
  //   console.log('GET /users response:', this.users);
  //   console.log('GET /users/3 response:', this.usersApi.get('user-3'));


  //   const createResponse = this.usersApi.create({
  //     name: 'Test User',
  //     email: 'test@example.com',
  //     role: 'Viewer',
  //     status: 'Active',
  //   });

  //   console.log('POST /users response:', createResponse);

  //   console.log(
  //     'GET /users last page:',
  //     this.usersApi.list(100, 25),
  //   );

  //   console.log(
  //     'POST /users/user-1/password-reset response:',
  //     this.usersApi.resetPassword('user-1'),
  //   );

  //   // Test updating a user

  //   // get user 1 before update
  //   const original = this.usersApi.get('user-1');
  //   console.log('GET /users/user-1 response:', original);

  //   // update user 1 
  //   const updateResponse = this.usersApi.update(
  //     'user-1',
  //     {
  //       name: 'Updated Yipee',
  //       email: 'updated@example.com',
  //       role: 'Admin',
  //       status: 'Active',
  //     },
  //     original.headers['ETag'],
  //   );

  //   // show result of update
  //   console.log('PUT /users/user-1 response:', updateResponse);

  //   console.log(
  //     'GET /users/user-1 after update:',
  //     this.usersApi.get('user-1'),
  //   );

  //   // testing stale ETAG
  //   try {
  //     this.usersApi.update(
  //       'user-1',
  //       {
  //         name: 'Another update',
  //         email: 'another@example.com',
  //         role: 'Viewer',
  //         status: 'Invited',
  //       },
  //       original.headers['ETag'],
  //     );
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       console.log('PUT /users/user-1 stale ETag error:', {
  //         status: error.status,
  //         message: error.message,
  //       });
  //     }
  //   }
  // }
}