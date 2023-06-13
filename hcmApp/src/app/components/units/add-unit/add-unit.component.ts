import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.css']
})
export class AddUnitComponent {
  //form group
  addUnit!: FormGroup;

  id:any
  unitDetails: any

  constructor (private fb: FormBuilder, 
    private modal: NgbModal,
    private router: Router, 
    private httpService: HttpService,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
  

    //NEW POSTING MODAL
    //set validations
    this.addUnit = this.fb.group({
      Name: ['', [Validators.required]]
    })
    

  }

  ngOnInit(){
    //get id from url
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];// geting id
    })

    // console.log(this.id)

    if (this.id) {
    this.httpService.get("http://localhost:8089/units/"+this.id).subscribe((results: any) => {
        this.unitDetails = results.data//setting result to modalData variable
        // console.log(this.unitDetails)
        //set validations
        this.addUnit = this.fb.group({
           Name: [this.unitDetails[0].Name, [Validators.required]]
        })
      })
    } 
  }


  submitForm(){

    if(this.id > ''){ //update
      //make http post request
      this.httpService.patch("http://localhost:8089/units/update/"+this.id, this.addUnit.value).subscribe((results: any) => {

      if(results.status){
        this.toastr.success('Unit Updated Successfully', 'Success!'); 
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
    }else{// new unit
      //make http post request
        this.httpService.post("http://localhost:8089/units/add", this.addUnit.value).subscribe((results: any) => {

        if(results.status){
          this.toastr.success('Unit Added Successfully', 'Success!'); 
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/units'])
            );
        }else{
          this.toastr.warning('Oops!! Error Occured', 'Error!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/units'])
            );
        }


      })
    }
    
    this.modal.dismissAll();
  }
 

  closeModal(){
    this.modal.dismissAll();
    // this.router.navigate(['/units'])
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        // this.router.navigate(['/manageUnits'])
    // );
  }
}
