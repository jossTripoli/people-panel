import { Component, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';
import { UsersApi } from '../features/users/users-api';
import { ApiError } from '../features/users/api-response';
import { FormsModule } from '@angular/forms';
import { CreateUserRequest, UpdateUserRequest, UserModel } from '../models/user';

@Component({
  imports: [Breadcrumb, FormsModule],
  selector: 'app-user',
  templateUrl: './user.html',
})
export class User implements OnDestroy {
  // angular service injecting 
  private readonly usersApi = inject(UsersApi);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private userLoadingTimer: ReturnType<typeof setTimeout> | null = null;

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
  hasEditConflict = false;

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
  isEditingUser = false;
  sidebarMessage = '';
  sidebarMessageType: 'success' | 'error' = 'success';

  editUser: UpdateUserRequest = {
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active',
  };

  viewUser(id: string) {
    // Cancel any previous simulated request.
    if (this.userLoadingTimer) {
      clearTimeout(this.userLoadingTimer);
      this.userLoadingTimer = null;
    }

    // Clear any message above the table.
    this.message = '';
  
    // Start with fresh sidebar state & open immediately (i.e. before the user data loads and use skeleton placeholders)
    this.selectedUser = null;
    this.selectedUserETag = '';
    this.isLoadingUser = true;
    this.isEditingUser = false;

    // Clear any message from the previously opened user and reset type
    this.sidebarMessage = '';
    this.sidebarMessageType = 'success';
    // for 412 error recovery actions reset it too
    this.hasEditConflict = false;
      
    // Simulate network latency while using the in-memory api
    this.userLoadingTimer = setTimeout(() => {
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
        this.userLoadingTimer = null;

        // Tell Angular immediately update the view after the simulated delay
        this.changeDetector.detectChanges();
      }
    }, 500);
  }

  closeUserDetails() {
    // cancel pending simulated request loading times when sidebar closes
    if (this.userLoadingTimer) {
      clearTimeout(this.userLoadingTimer);
      this.userLoadingTimer = null;
    }

    // Reset all user-details sidebar state.
    this.selectedUser = null;
    this.selectedUserETag = '';
    this.isLoadingUser = false;
    this.sidebarMessage = '';
    this.sidebarMessageType = 'success';

    this.hasEditConflict = false;

    this.editUser = {
      name: '',
      email: '',
      role: 'Viewer',
      status: 'Active',
    };
  }

  // seperate editable copy of data so selectedUser isn't immediately changed until changes are submitted
  startEditingUser() {
    if (!this.selectedUser) {
      return;
    }

    this.editUser = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
      status: this.selectedUser.status,
    };

    this.isEditingUser = true;
  }

  cancelEditingUser() {
    this.isEditingUser = false;
  }

  // PUT call
  saveUser() {
    if (!this.selectedUser) {
      return;
    }

    try {
      const response = this.usersApi.update(
        this.selectedUser.id,
        this.editUser,
        this.selectedUserETag,
      );

      // replace the displayed user with the updated response
      this.selectedUser = response.body;

      // store the new ETag returned by the update
      this.selectedUserETag = response.headers['ETag'];

      // refresh the current table page so the changes appear there too
      this.users = this.usersApi.list(this.skip, this.limit);

      this.isEditingUser = false;

      this.sidebarMessage  = `${response.body.name} was updated successfully.`;
      this.messageType = 'success';
    } catch (error) {
      this.messageType = 'error';

      if (error instanceof ApiError && error.status === 412) {
        this.hasEditConflict = true;
        this.sidebarMessageType = 'error';
        this.sidebarMessage = 'This user was updated while you were editing. Choose how you want to continue.';
      } else if (error instanceof ApiError) {
        this.sidebarMessage  = error.message;
      } else {
        this.sidebarMessage  = 'Something went wrong while updating the user.';
      }
    }
  }

  // so we will start with a fresh component and no leftover timer next time
  ngOnDestroy() {
    if (this.userLoadingTimer) {
      clearTimeout(this.userLoadingTimer);
    }
  }

  simulateConcurrentUpdate() {
    if (!this.selectedUser) {
      return;
    }

    const latest = this.usersApi.get(this.selectedUser.id);

    this.usersApi.update(
      this.selectedUser.id,
      {
        name: latest.body.name,
        email: latest.body.email,
        role: latest.body.role,
        status: latest.body.status,
      },
      latest.headers['ETag'],
    );

    this.sidebarMessage =
      'Concurrent update simulated. Click Save Changes to test the conflict.';
    this.sidebarMessageType = 'success';
  }

  loadLatestUser() {
    if (!this.selectedUser) {
      return;
    }

    try {
      const response = this.usersApi.get(this.selectedUser.id);

      this.selectedUser = response.body;
      this.selectedUserETag = response.headers['ETag'];

      this.editUser = {
        name: response.body.name,
        email: response.body.email,
        role: response.body.role,
        status: response.body.status,
      };

      this.hasEditConflict = false;

      this.sidebarMessage =
        'The latest version has been loaded. Review it before saving.';
      this.sidebarMessageType = 'success';
    } catch (error) {
      this.sidebarMessageType = 'error';

      if (error instanceof ApiError) {
        this.sidebarMessage = error.message;
      } else {
        this.sidebarMessage = 'Something went wrong while loading the latest user.';
      }
    }
  }

  keepMyChanges() {
    if (!this.selectedUser) {
      return;
    }

    try {
      // Get the newest ETag first.
      const latest = this.usersApi.get(this.selectedUser.id);

      // Retry using the edits already in the form.
      const response = this.usersApi.update(
        this.selectedUser.id,
        this.editUser,
        latest.headers['ETag'],
      );

      this.selectedUser = response.body;
      this.selectedUserETag = response.headers['ETag'];

      this.users = this.usersApi.list(this.skip, this.limit);

      this.isEditingUser = false;
      this.hasEditConflict = false;

      this.sidebarMessage =
        `${response.body.name} was updated successfully.`;
      this.sidebarMessageType = 'success';
    } catch (error) {
      this.sidebarMessageType = 'error';

      if (error instanceof ApiError && error.status === 412) {
        this.sidebarMessage =
          'The user changed again before the update completed. Try again.';
      } else if (error instanceof ApiError) {
        this.sidebarMessage = error.message;
      } else {
        this.sidebarMessage = 'Something went wrong while updating the user.';
      }
    }
  }

  resetPassword() {
    if (!this.selectedUser) {
      return;
    }

    try {
      this.usersApi.resetPassword(this.selectedUser.id);

      this.sidebarMessage =
        `Password reset instructions were sent for ${this.selectedUser.name}.`;
      this.sidebarMessageType = 'success';
    } catch (error) {
      this.sidebarMessageType = 'error';

      if (error instanceof ApiError) {
        this.sidebarMessage = error.message;
      } else {
        this.sidebarMessage =
          'Something went wrong while resetting the password.';
      }
    }
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