import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {

  //form group
  addEmp!: FormGroup;
  unitList: any
  imageName: any = 'dummy.png'
  url: any = 'assets/img/dummy.png'
  id: any
  date: any
  empDetails: any



  constructor (private fb: FormBuilder, 
    private modal: NgbModal,
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
    

    //NEW EMPLOYEE MODAL
    //set validations
    this.addEmp = this.fb.group({
      emp_id: ['', [Validators.required]],
      emp_email: ['', [Validators.required, Validators.email]],
      emp_firstname: ['', [Validators.required]],
      emp_middlename: [''],
      emp_surname: ['', [Validators.required]],
      emp_gender: ['', [Validators.required]],
      emp_dob: ['', [Validators.required]],
      emp_maritalstatus: ['', [Validators.required]],
      emp_phoneno: ['', [Validators.required]],
      emp_highestqualification: ['', [Validators.required]],
      emp_staffstatus: ['', [Validators.required]],
      emp_yearswithministry: ['', [Validators.required]],
      unit_id: ['', [Validators.required]],
      photo: ['']
    })


  }

  ngOnInit():void{
    this.getUnitList()

    //get id from url
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];// geting id
    })
    

    if (this.id) {
      this.http.get("http://localhost:8080/api/employees/"+this.id).subscribe((results: any) => {
        // console.log(results.data)
        this.empDetails = results.data

        if (this.empDetails[0].photo == ''){
          this.url = 'assets/img/dummy.png'
          this.imageName = 'dummy.png'
        }else{
          this.url = 'assets/img/'+this.empDetails[0].photo
          this.imageName = this.empDetails[0].photo
        }
        

        this.addEmp = this.fb.group({
          emp_id: [this.empDetails[0].emp_id, [Validators.required]],
          emp_email: [this.empDetails[0].emp_email, [Validators.required, Validators.email]],
          emp_firstname: [this.empDetails[0].emp_firstname, [Validators.required]],
          emp_middlename: [this.empDetails[0].emp_middlename],
          emp_surname: [this.empDetails[0].emp_surname, [Validators.required]],
          emp_gender: [this.empDetails[0].emp_gender, [Validators.required]],
          emp_dob: [this.conDate(this.empDetails[0].emp_dob), [Validators.required]],
          emp_maritalstatus: [this.empDetails[0].emp_maritalstatus, [Validators.required]],
          emp_phoneno: [this.empDetails[0].emp_phoneno, [Validators.required]],
          emp_highestqualification: [this.empDetails[0].emp_highestqualification, [Validators.required]],
          emp_staffstatus: [this.empDetails[0].emp_staffstatus, [Validators.required]],
          emp_yearswithministry: [this.empDetails[0].emp_yearswithministry, [Validators.required]],
          unit_id: [this.empDetails[0].unit_id, [Validators.required]],
          photo: [this.empDetails[0].photo]
        })

        
      })
    } 

  }

  submitForm(){
    //set values
    this.addEmp.value.photo = this.imageName

    if(this.id > ''){ //updating
      //make http post request
      this.http.put("http://localhost:8080/api/employees/update/"+this.id, this.addEmp.value).subscribe((results: any) => {
        // console.log(results.status)
        if(results.status){
          this.toastr.success('Employee Updated Successfully', 'Success!');
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
    }else{
        // make http post request
      this.http.post("http://localhost:8080/api/employees/add", this.addEmp.value).subscribe((results: any) => {
        // console.log(results.status)
        if(results.status){
          this.toastr.success('Employee Added Successfully', 'Success!');
            // this.router.navigate(['/manage-employees'])
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/employees'])
            );
        }else{
          this.toastr.warning('Oops!! Error Occured', 'Error!');
            // this.router.navigate(['/manage-employees'])
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(['/employees'])
            );
        }
      })
    }

    this.modal.dismissAll();
    
  }

  getUnitList(){
    this.http.get("http://localhost:8080/api/units").subscribe((results: any) => {
      this.unitList =  results.data
      // console.log(this.unitList)
    })
  }

  onFileSelected(event:any) {
    this.imageName = event.target.files[0].name;

    if(event.target.files[0]){
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result
      }
    }
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
    // this.router.navigate(['/employees'])
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //     this.router.navigate(['/employees'])
    // );
  }

}
