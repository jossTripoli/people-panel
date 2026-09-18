import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';

@Component({
  imports: [Breadcrumb],
  selector: 'app-activity',
  templateUrl: './activity.html',
})
export class Activity {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Activity' },
  ];
}
