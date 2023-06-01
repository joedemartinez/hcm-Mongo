import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-posting',
  templateUrl: './add-posting.component.html',
  styleUrls: ['./add-posting.component.css']
})
export class AddPostingComponent {
  //form group
  addPosting!: FormGroup;
  empList: any
  id: any
  postingDetails:any
  date: any

  constructor (private fb: FormBuilder, 
    private modal: NgbModal,
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
  

    //NEW POSTING MODAL
    //set validations
    this.addPosting = this.fb.group({
      emp_id: ['', [Validators.required]],
      post_from: ['', [Validators.required]],
      post_to: ['', [Validators.required]],
      region: ['', [Validators.required]],
      effectiveDate: ['', [Validators.required]],
      releaseDate: ['', [Validators.required]],
      assumptionDate: ['', [Validators.required]]
    })


  }

  

  ngOnInit():void{
    this.getEmpList()


    //get id from url
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];// geting id
    })

    // console.log(this.id)

    if (this.id) {
    this.http.get("http://localhost:8080/api/postings/"+this.id).subscribe((results: any) => {
        this.postingDetails = results.data//setting result to modalData variable
        // console.log(this.postingDetails)
        //set validations

        this.addPosting = this.fb.group({
          emp_id: [this.postingDetails[0].emp_id, [Validators.required]],
          post_from: [this.postingDetails[0].post_from, [Validators.required]],
          post_to: [this.postingDetails[0].post_to, [Validators.required]],
          region: [this.postingDetails[0].region, [Validators.required]],
          effectiveDate: [this.conDate(this.postingDetails[0].effectiveDate), [Validators.required]],
          releaseDate: [this.conDate(this.postingDetails[0].releaseDate), [Validators.required]],
          assumptionDate: [this.conDate(this.postingDetails[0].assumptionDate), [Validators.required]]
        })
      })
    } 
  }

  submitForm(){

    // console.log(this.id)

    if(this.id > ''){ //updating posting
       //make http post request
      this.http.put("http://localhost:8080/api/postings/update/"+this.id, this.addPosting.value).subscribe((results: any) => {
        // console.log(results.status)
        if(results.status){
          this.toastr.success('Posting Updated Successfully', 'Success!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/managePostings'])
            );
        }else{
          this.toastr.warning('Oops!! Error Occured', 'Error!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/managePostings'])
            );
        }

      })
    }else{//new posting
      //make http post request
      this.http.post("http://localhost:8080/api/postings/add", this.addPosting.value).subscribe((results: any) => {
        
        if(results.status){
          this.toastr.success('Posting Added Successfully', 'Success!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/postings'])
            );
        }else{
          this.toastr.warning('Oops!! Error Occured', 'Error!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/postings'])
            );
        }

      })
    }
    
    this.modal.dismissAll();
  }

  getEmpList(){
    this.http.get("http://localhost:8080/api/employees").subscribe((results: any) => {
      this.empList =  results.data
      // console.log(this.empList)
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

  closeModal(){
    this.modal.dismissAll();
    // this.router.navigate(['/postings'])
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //     this.router.navigate(['/postings'])
    // );
  }
}
