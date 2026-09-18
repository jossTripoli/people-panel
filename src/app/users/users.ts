import { Component } from '@angular/core';
import { Breadcrumb } from '../breadcrumb/breadcrumb';

@Component({
  imports: [Breadcrumb],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {}
