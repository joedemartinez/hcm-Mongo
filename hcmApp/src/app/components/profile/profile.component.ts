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
 
  constructor (private modal: NgbModal) {

    this.emp_id = localStorage.getItem('emp_id')
    this.name = localStorage.getItem('name')
    this.user_type = localStorage.getItem('user_type')
  }
 
  closeModal(){
    this.modal.dismissAll();
 
  }

}
