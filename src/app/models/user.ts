export type UserRole = 'Admin' | 'Editor' | 'Viewer';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}