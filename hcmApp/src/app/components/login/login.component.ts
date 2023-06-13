import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
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
    private toastr: ToastrService,
    private bnIdle: BnNgIdleService) {

    //set validations
    this.loginFb = this.fb.group({
      emp_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })

    this.bnIdle.stopTimer();
    
  }
  
  
  //login form submission
  submitForm(){
    // this.login.login(this.loginFb.value.email, this.loginFb.value.password)

    //make http post request
    this.http.post("http://localhost:8089/login", this.loginFb.value).subscribe((results: any) => {
    // console.log(results.data)
    
    //get token values
    const parts = results.token.split('.');
    // Decode the base64-encoded payload
    const payload = JSON.parse(atob(parts[1]))


      if(results.status === true){
        // set local storage vals
        localStorage.setItem('loggedIn', 'true')
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
