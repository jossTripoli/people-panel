import { Service } from '@angular/core';
import { UserModel, UserRole, UserStatus, UsersResponse } from '../../models/user';
import { ApiResponse, ApiError } from './api-response';
import { seedUsers, StoredUser } from './seed-users';

@Service()
export class UsersApi {
  // in memory user store. array of user objects
  private users: StoredUser[] = seedUsers(100);

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
}
