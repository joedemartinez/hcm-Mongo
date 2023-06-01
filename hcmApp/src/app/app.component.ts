import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'HCM APP';
  log:any


  ngAfterViewInit(){
    setInterval(()=>{
      // Read the initial value from local storage
      this.log = localStorage.getItem('loggedIn');

      // Listen for the storage event and update the value in real-time
      window.addEventListener('storage', () => {
        this.log = localStorage.getItem('loggedIn');
      });

    },1) 
  }

}
