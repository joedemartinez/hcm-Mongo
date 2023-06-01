import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { AddUnitComponent } from '../add-unit/add-unit.component';

@Component({
  selector: 'app-manage-units',
  templateUrl: './manage-units.component.html',
  styleUrls: ['./manage-units.component.css']
})
export class ManageUnitsComponent {
  units: any
  unitsDetails: any
  unitsHistory:any
  date: any
  
  constructor ( private breadcrumb: BreadcrumbService, private toastr: ToastrService,
    private http: HttpClient,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {

    this.breadcrumb.setPageDetails('Manage Units','Units','/unit','Manage Units')//breadcrumb values

    this.getUnitDetails();//get unit details


  }

  getUnitDetails(){
    //unit
    this.http.get("http://localhost:8080/api/units").subscribe((results: any) => {
      this.unitsDetails =  results.data
      setTimeout(()=>{
        $('#unitsDataTable').DataTable( {
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
  editUnit(){
    this.modal.open(AddUnitComponent, { backdrop: false, size: 'sm' })
  }

  deleteUnit(id:any){
    const proceed = confirm('Are you sure you want to delete this unit?');


    if(proceed){
      // console.log(id)
      //make http post request
      this.http.delete("http://localhost:8080/api/units/delete/"+id).subscribe((results: any) => {

        if(results.status){
          this.toastr.success('Unit Deleted Successfully', 'Success!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/manageUnits'])
            );
        }else{
          this.toastr.warning('Oops!! Error Occured', 'Error!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/manageUnits'])
            );
        }
      })
    }

    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //     this.router.navigate(['/manageUsers'])
    // );
  }
}
