import { Component } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  pageTitle = ''
  parentPageTitle = ''
  parentLink = ''

  childPageTitle = ''

  constructor ( private breadcrumb: BreadcrumbService) {
    this.breadcrumb.getPageDetails().subscribe(data => {
      this.pageTitle = data.pageTitle;
      this.parentPageTitle = data.parentPageTitle;
      this.parentLink = data.parentLink;
      this.childPageTitle = data.childPageTitle;
    })
  }
}
