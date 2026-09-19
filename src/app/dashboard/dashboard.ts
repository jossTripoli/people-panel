import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersApi } from '../features/users/users-api';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly usersApi = inject(UsersApi);

  snapshot = this.usersApi.getSnapshot();
}
