import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPageGuard implements CanActivate {

  constructor(private router: Router){}

  log: any
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      
      // Read the initial value from local storage
    this.log = localStorage.getItem('loggedIn');

    // Listen for the storage event and update the value in real-time
    setInterval(()=>{
      window.addEventListener('storage', () => {
        this.log = localStorage.getItem('loggedIn');
      })
    },1)


    if (this.log !== 'true') {
      return true; //if logged In
    } else {
      this.router.navigate(['/dashboard']) //go to login page if not logged in
      return false
    }
  }
  
}
