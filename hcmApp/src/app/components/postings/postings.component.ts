import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { AddPostingComponent } from './add-posting/add-posting.component';

@Component({
  selector: 'app-postings',
  templateUrl: './postings.component.html',
  styleUrls: ['./postings.component.css']
})
export class PostingsComponent {
  posting: any
  postingDetails: any
  date: any
  priv:any
  
  constructor ( private breadcrumb: BreadcrumbService, private toastr: ToastrService,
    private http: HttpClient,
    private modal: NgbModal,
    private router: Router) {

    this.breadcrumb.setPageDetails('Postings','Postings','/postings','')//breadcrumb values

    this.getPostingDetails();//get employees details

    this.priv = localStorage.getItem('user_type')
  }

  getPostingDetails(){
    //posting
    this.http.get("http://localhost:8080/api/postings").subscribe((results: any) => {
      this.postingDetails =  results.data
      
      setTimeout(()=>{
        $('#postingDataTable').DataTable( {
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
    this.modal.open(AddPostingComponent, { backdrop: false, size: 'lg' })
  }

  //edit mode
  editMode(){
    this.router.navigateByUrl('/managePostings')
  }
}
