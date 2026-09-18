import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';
import { User } from '../models/user';

@Component({
  imports: [Breadcrumb],
  selector: 'app-users',
  templateUrl: './users.html',
})
export class Users {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Users' },
  ];

  readonly users: readonly User[] = [
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
  ];
 
}
