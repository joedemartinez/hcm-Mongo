import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //form group
  loginFb: FormGroup;

  constructor (private fb: FormBuilder,
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService) {

    //set validations
    this.loginFb = this.fb.group({
      emp_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
    
  }
  
  
  //login form submission
  submitForm(){
    // this.login.login(this.loginFb.value.email, this.loginFb.value.password)

    //make http post request
    this.http.post("http://localhost:8080/api/login/"+this.loginFb.value.emp_id, this.loginFb.value).subscribe((results: any) => {

      if(results.status){
        // set local storage vals
        localStorage.setItem('loggedIn', 'true')
        localStorage.setItem('emp_id', results.data[0].emp_id) // set storage val
        localStorage.setItem('name', results.data[0].name)
        localStorage.setItem('user_type', results.data[0].user_type)
        localStorage.setItem('photo', results.data[0].photo)

        this.toastr.success('Login Successful', 'Success!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/dashboard'])
          );
           
      }else{
        this.toastr.warning('Oops!! Wrong Staff ID or Password', 'Error!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/login'])
          );
      }
    })
  }

}
