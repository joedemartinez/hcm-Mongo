import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { AddUserComponent } from './add-user/add-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  user: any
  usersDetails: any
  empList:any
  date: any
  priv:any
  
  constructor ( private breadcrumb: BreadcrumbService, private toastr: ToastrService,
    private http: HttpClient,
    private modal: NgbModal,
    private router: Router) {

    this.breadcrumb.setPageDetails('Users','Users','/users','')//breadcrumb values

    this.getUsersDetails();//get Users details
    this.getEmpList() //

    this.priv = localStorage.getItem('user_type')

  }


  getUsersDetails(){
    //using aggregate to join users and emp table
    this.http.get("http://localhost:8089/userEmp").subscribe((results: any) => {
      this.usersDetails =  results.data
      console.log(this.usersDetails)
      setTimeout(()=>{
        $('#usersDataTable').DataTable( {
          pagingType: 'simple_numbers',
          dom: 'C<"clear">lBfrtip',
          // dom: '<B<"clear">liflp',
          pageLength: 10,
          searching: true,
          processing: true,
          lengthMenu : [5, 10, 25, 50],
          destroy: true
        } );
      }, 2);
    })
  }

  getEmpList(){
    //users 
    this.http.get("http://localhost:8089/employees").subscribe((results: any) => {
      this.empList =  results.data
      
    })
  }

  

  conDate(val:any){ //conveting date to proper format
    this.date = new Date(val)
    const year = this.date.getFullYear();
    const month = ('0' + (this.date.getMonth() + 1)).slice(-2); // add leading zero if month is single digit
    const day = ('0' + this.date.getDate()).slice(-2); // add leading zero if day is single digit
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  //open modal
  openModal(){
    this.modal.open(AddUserComponent, { backdrop: false, size: 'sm' })
  }

  //edit mode
  editMode(){ 
    this.router.navigate(['/manageUsers'])
  }
}
