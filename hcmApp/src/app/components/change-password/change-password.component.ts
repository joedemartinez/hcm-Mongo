import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LogoutService } from 'src/app/services/logout.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  //form group
  changePasswordForm: FormGroup;
  empList: any
  id: any

  constructor (private fb: FormBuilder, 
    private modal: NgbModal,
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService,
    private logout: LogoutService) {
  

    //set validations
    // this.changePassword = this.fb.group({
    //   newpassword: ['', [Validators.required]],
    //   cpassword: ['', [Validators.required]]
    // })
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  submitForm(){
    // set id value
    this.id = localStorage.getItem('emp_id')

    //make http post request
    this.http.put("http://localhost:8080/api/password/update/"+this.id, this.changePasswordForm.value).subscribe((results: any) => {

      if(results.status){
        this.toastr.success('Password Change Successful. \n Please Log In Again', 'Success!');
        this.closeModal()
        this.logout.logout()
          // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
          //     this.router.navigate(['/manageUsers'])
          // );

      }else{
        this.toastr.warning('Oops!! Error Occured', 'Error!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/dashboard'])
          );
      }
    })
    
  }
 

  closeModal(){
    this.modal.dismissAll();
  }
}
