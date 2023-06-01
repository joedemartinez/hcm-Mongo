import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  constructor() { }

  pageDetails = new BehaviorSubject<{pageTitle:string,parentPageTitle:string,parentLink:string,childPageTitle:string}>({
    pageTitle: '',
    parentPageTitle: '',
    parentLink: '',
    childPageTitle: ''
  })

  setPageDetails(pageTitle:string,parentPageTitle:string,parentLink:string,childPageTitle:string){
    this.pageDetails.next({pageTitle,parentPageTitle,parentLink,childPageTitle})
  }

  getPageDetails(){
    return of(this.pageDetails.getValue())
  }
}
