import { Service } from '@angular/core';
import { UserModel, UsersResponse } from '../../models/user';
import { ApiResponse, ApiError } from './api-response';

@Service()
export class UsersApi {
  // in memory user store. array of user objects
  private users: UserModel[] = [
    {
      id: 'user-1',
      name: 'Joss Tripoli',
      email: 'joss@example.com',
      role: 'Admin',
      status: 'Active',
      createdAt: '2026-08-12T14:30:00Z',
      updatedAt: '2026-09-15T10:15:00Z',
    },
    {
      id: 'user-2',
      name: 'Jordan Smith',
      email: 'jordan@example.com',
      role: 'Editor',
      status: 'Active',
      createdAt: '2026-08-18T09:00:00Z',
      updatedAt: '2026-09-10T16:45:00Z',
    },
    {
      id: 'user-3',
      name: 'Morgan Ruth',
      email: 'morgan@example.com',
      role: 'Viewer',
      status: 'Invited',
      createdAt: '2026-09-01T12:00:00Z',
      updatedAt: '2026-09-01T12:00:00Z',
    },
    {
      id: 'user-4',
      name: 'Bob Joe',
      email: 'bob@example.com',
      role: 'Viewer',
      status: 'Active',
      createdAt: '2026-08-12T09:00:00Z',
      updatedAt: '2026-09-11T12:45:00Z',
    },
    {
      id: 'user-5',
      name: 'Jane Johns',
      email: 'jane@example.com',
      role: 'Viewer',
      status: 'Active',
      createdAt: '2026-08-17T07:00:00Z',
      updatedAt: '2026-09-10T12:45:00Z',
    },
  ];

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
        items: this.users.slice(skip, skip + limit),
        total: this.users.length,
      },
    };
  }
}
