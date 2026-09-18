import { UserModel, UserRole, UserStatus } from '../../models/user';

export interface StoredUser {
  user: UserModel;
  version: number;
}

// name lists to generate realistic looking users
const firstNames = [
  'Ava',
  'John',
  'Bob',
  'Jane',
  'Sam',
  'Emma',
  'Mike',
  'Anna',
  'Chris',
  'Lisa',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Wilson',
  'Taylor',
  'Moore',
  'Anderson',
];

const roles: UserRole[] = ['Admin', 'Editor', 'Viewer'];
const statuses: UserStatus[] = ['Active', 'Invited', 'Suspended'];

export function seedUsers(count = 100): StoredUser[] {
  const users: StoredUser[] = [];

  // Go through each last name
  for (const lastName of lastNames) {
    // for each last name combine it with every first name
    for (const firstName of firstNames) {
      // stop if we've created enough names
      if (users.length >= count) {
        return users;
      }

      // create user number using current array length
      const number = users.length + 1;

      users.push({
        user: {
          id: `user-${number}`,
          name: `${firstName} ${lastName}`,
          email: `${firstName}.${lastName}${number}@example.com`.toLowerCase(),
          role: roles[number % roles.length],
          status: statuses[number % statuses.length],
          createdAt: '2026-01-01T12:00:00Z',
          updatedAt: '2026-01-01T12:00:00Z',
        },
        // Internal version to create ETag values.
        version: 1,
      });
    }
  }

  return users;
}