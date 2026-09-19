import { Service } from '@angular/core';
import { UserModel, UsersResponse, CreateUserRequest, UpdateUserRequest } from '../../models/user';
import { ApiResponse, ApiError } from './api-response';
import { seedUsers, StoredUser } from './seed-users';

@Service()
export class UsersApi {
  // in memory user store. array of user objects
  private users: StoredUser[] = seedUsers(50000);

  // GET /users
  list(skip = 0, limit = 25): ApiResponse<UsersResponse> {
    if (!Number.isInteger(skip) || skip < 0) {
      throw new ApiError(400, 'Invalid skip value.');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ApiError(400, 'Invalid limit value.');
    }

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        items: this.users
          .slice(skip, skip + limit)
          .map((storedUser) => storedUser.user),
        total: this.users.length,
      },
    };
  }

  // GET /users/:id
  get(id: string): ApiResponse<UserModel> {
    const storedUser = this.users.find((item) => item.user.id === id);

    if (!storedUser) {
      throw new ApiError(404, 'User not found.');
    }

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ETag: `"${storedUser.version}"`,
      },
      body: {
        ...storedUser.user,
      },
    };
  }

  // POST /users
  create(request: CreateUserRequest): ApiResponse<UserModel> {
    const now = new Date().toISOString();
    const number = this.users.length + 1;

    const user: UserModel = {
      id: `user-${number}`,
      name: request.name,
      email: request.email,
      role: request.role,
      status: request.status,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push({
      user,
      version: 1,
    });

    return {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ETag: '"1"',
      },
      body: {
        ...user,
      },
    };
  }


  // POST /users/:id/password-reset
  resetPassword(id: string): ApiResponse<void> {
    const storedUser = this.users.find((item) => item.user.id === id);

    if (!storedUser) {
      throw new ApiError(404, 'User not found.');
    }

    /*
      In later this action could be implemented by generating a secure one-time password reset token and sending
      it to the user via reset link by email through an email service such as AWS SES.
      For now this simulates the successful action.
    */
    return {
      status: 204,
      headers: {},
      body: undefined,
    };
  }


  // PUT /users/:id
  update(
    id: string,
    request: UpdateUserRequest,
    ifMatch: string,
  ): ApiResponse<UserModel> {
    // Find the user to be updated
    const storedUser = this.users.find((item) => item.user.id === id);

    if (!storedUser) {
      throw new ApiError(404, 'User not found.');
    }

    // Only update if the client is using the latest version it read.
    const currentETag = `"${storedUser.version}"`;

    if (ifMatch !== currentETag) {
      throw new ApiError(412, 'Precondition failed.');
    }

    // Create the updated user data and update updatedAt.
    const updatedUser: UserModel = {
      ...storedUser.user,
      ...request,
      updatedAt: new Date().toISOString(),
    };

    // Save the updated user and increment its version.
    storedUser.user = updatedUser;
    storedUser.version++;

    // Return the updated user.
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ETag: `"${storedUser.version}"`,
      },
      body: {
        ...updatedUser,
      },
    };
  }

  // get stats for dashboard snapshot
  getSnapshot() {
    return {
      total: this.users.length,
      active: this.users.filter(
        (storedUser) => storedUser.user.status === 'Active',
      ).length,
      invited: this.users.filter(
        (storedUser) => storedUser.user.status === 'Invited',
      ).length,
      suspended: this.users.filter(
        (storedUser) => storedUser.user.status === 'Suspended',
      ).length,
    };
  }

}
