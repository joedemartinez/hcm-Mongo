import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LogoutService } from 'src/app/services/logout.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  emp: any
  exits:any
  units:any
  users:any
  emp_name:any
  photo:any

  constructor ( private http: HttpClient,
    private logout: LogoutService) {
    this.getVal()
  }

  ngOnInit(){
    // Read the initial value from local storage
    this.emp_name = localStorage.getItem('name');
    this.photo = localStorage.getItem('photo')
  }

  getVal(){
    //Emp
    this.http.get("http://localhost:8089/count/employees").subscribe((results: any) => {
      this.emp =  results.data[0]?.count
    })
    //Exits
    this.http.get("http://localhost:8089/count/exits").subscribe((results: any) => {
      this.exits =  results.data[0]?.count
    })
    //units
    this.http.get("http://localhost:8089/count/units").subscribe((results: any) => {
      this.units =  results.data[0]?.count 
    })
    //Users
    this.http.get("http://localhost:8089/count/users").subscribe((results: any) => {
      this.users = results.data[0]?.count
    })
  }

  logOut(){
    this.logout.logout()
  }
}
