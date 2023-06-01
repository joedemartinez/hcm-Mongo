import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor (private router: Router,private toastr: ToastrService) { }

  //logout
  logout(){
      localStorage.setItem('loggedIn', 'false')
      localStorage.clear()
      this.toastr.success('You Have Logged Out Successfully', 'Success!');
      this.router.navigate(['/login'])   
  }

}
