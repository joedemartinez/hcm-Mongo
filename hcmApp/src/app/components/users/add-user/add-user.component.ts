import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  //form group
  addUser!: FormGroup;
  empList: any

  constructor (private fb: FormBuilder, 
    private modal: NgbModal,
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService) {
  

    // MODAL
    //set validations
    this.addUser = this.fb.group({
      emp_id: ['', [Validators.required]],
      user_type: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })

  }

  ngOnInit():void{
    this.getEmpList()
  }


  submitForm(){

    //make http post request
    this.http.post("http://localhost:8080/api/users/add", this.addUser.value).subscribe((results: any) => {

      if(results.status){
        this.toastr.success('User Added Successfully', 'Success!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/users'])
          );
      }else{
        this.toastr.warning('Oops!! Error Occured', 'Error!');
          this.router.navigateByUrl('/users', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/users'])
          );
      }

      this.closeModal()
    })
    
  }

  getEmpList(){
    this.http.get("http://localhost:8080/api/usersList").subscribe((results: any) => {
      this.empList =  results.data
    })
  }
 

  closeModal(){
    this.modal.dismissAll();
    // this.router.navigate(['/users'])
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //     this.router.navigate(['/users'])
    // );
  }
}
