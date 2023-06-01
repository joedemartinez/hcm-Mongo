import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css']
})
export class ManageEmployeesComponent {
  emp: any
  empDetails: any
  date: any
  ifMe:any
  
  constructor ( private breadcrumb: BreadcrumbService, private toastr: ToastrService,
    private http: HttpClient,
    private modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute) {
   
    this.breadcrumb.setPageDetails('Manage Employees','Employees','/employees','Manage Employees')//breadcrumb values

    this.getEmpVal();//get total employees

    this.getEmpDetails();//get employees details

    this.ifMe = localStorage.getItem('emp_id')
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
  editEmployee(){
    this.modal.open(AddEmployeeComponent, { backdrop: false, size: 'lg' })
  }

  editMode(){
    this.router.navigateByUrl('/manageEmployees')
  }

  deleteEmployee(id:any){
    // console.log(id)
    const proceed = confirm('Are you sure you want to delete this employees?. \n Note: User account will also be deleted');


    if(proceed){
      // console.log(id)
      //make http post request
      this.http.delete("http://localhost:8080/api/employees/delete/"+id).subscribe((results: any) => {

        if(results.status){
          this.toastr.success('Unit Deleted Successfully', 'Success!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/manageEmployees'])
            );
        }else{
          this.toastr.warning('Oops!! Error Occured', 'Error!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/manageEmployees'])
            );
        }
      })
    }
  }


}
