import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
@Component({
  imports: [RouterLink],
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  items = input.required<readonly BreadcrumbItem[]>();
}
