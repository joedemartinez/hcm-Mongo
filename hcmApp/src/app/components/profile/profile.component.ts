import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

   emp_id:any
   name:any
   user_type:any
   token:any
 
  constructor (private modal: NgbModal) {

    // Read the initial value from local storage
    this.token = localStorage.getItem('jwt');
    //get token values
    const parts = this.token.split('.');
    // Decode the base64-encoded payload
    const payload = JSON.parse(atob(parts[1]))

    this.emp_id = payload.user
    this.name = payload.name
    this.user_type = payload.user_type
  }
 
  closeModal(){
    this.modal.dismissAll();
 
  }

}
