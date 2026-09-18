export type UserRole = 'Admin' | 'Editor' | 'Viewer';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface UserModel {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// Describes what will go in the http body
export interface UsersResponse {
  readonly items: readonly UserModel[];
  readonly total: number;
}