import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'Activity', path: '/activity' },
  ];
}
