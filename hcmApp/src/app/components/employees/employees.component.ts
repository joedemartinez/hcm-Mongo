import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

 
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  emp: any
  empDetails: any
  date: any
  priv: any
  
  constructor ( private breadcrumb: BreadcrumbService, private toastr: ToastrService,
    private http: HttpClient,
    private modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute) {
   
    this.breadcrumb.setPageDetails('Employees','Employees','/employees','')//breadcrumb values

    this.getEmpVal();//get total employees

    this.getEmpDetails();//get employees details

    this.priv = localStorage.getItem('user_type')
  }

 
  //get number of employees
  getEmpVal(){
    //Emp
    this.http.get("http://localhost:8080/api/count/emps").subscribe((results: any) => {
      this.emp =  results.data[0]['count']
    })
  }

  getEmpDetails(){
    //Emp
    this.http.get("http://localhost:8080/api/employees").subscribe((results: any) => {
      this.empDetails =  results.data
      
      setTimeout(()=>{
        $('#empDataTable').DataTable( {
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
    this.modal.open(AddEmployeeComponent, { backdrop: false, size: 'lg' })
  }

  editMode(){
    this.router.navigateByUrl('/manageEmployees')
  }
}
