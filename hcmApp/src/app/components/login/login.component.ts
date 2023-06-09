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
    this.http.post("http://localhost:8089/login", this.loginFb.value).subscribe((results: any) => {
    console.log(results.data)
    console.log(results.token)

      if(results.status === true){
        // set local storage vals
        localStorage.setItem('loggedIn', 'true')
        localStorage.setItem('emp_id', results.data[0].emp_id) // set storage val
        localStorage.setItem('name', results.data[0].employee[0].name)
        localStorage.setItem('user_type', results.data[0].user_type)
        localStorage.setItem('photo', results.data[0].employee[0].photo)
        localStorage.setItem('jwt', results.token)

        this.toastr.success('Login Successful', 'Success!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/dashboard'])
          );
           
      }else{
        this.toastr.warning(results.message, 'Error!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/login'])
          );
      }
    })
  }

}
