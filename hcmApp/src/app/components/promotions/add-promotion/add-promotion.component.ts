import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.css']
})
export class AddPromotionComponent {
  //form group
  addPromotion!: FormGroup;
  empList: any

  constructor (private fb: FormBuilder, 
    private modal: NgbModal,
    private router: Router, 
    private httpService: HttpService,
    private toastr: ToastrService) {
  

    //NEW POSTING MODAL
    //set validations
    this.addPromotion = this.fb.group({
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
  }

  submitForm(){

    //make http post request
    this.httpService.post("http://localhost:8089/promotions/add", this.addPromotion.value).subscribe((results: any) => {

      if(results.status){
        this.toastr.success('Promotion Added Successfully', 'Success!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/promotions'])
          );
      }else{
        this.toastr.warning('Oops!! Error Occured', 'Error!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/promotions'])
          );
      }
    })
    this.modal.dismissAll();
  }

  getEmpList(){
    this.httpService.get("http://localhost:8089/employees").subscribe((results: any) => {
      this.empList =  results.data
      // console.log(this.empList)
    })
  }

  closeModal(){
    this.modal.dismissAll();
    // this.router.navigate(['/promotions'])
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //     this.router.navigate(['/promotions'])
    // );
  }
}
