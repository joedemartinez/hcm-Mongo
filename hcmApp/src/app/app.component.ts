import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle'; //bn ng idle
import { LogoutService } from './services/logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'HCM APP';
  log:any

  constructor(private bnIdle: BnNgIdleService,private logout: LogoutService) {
    
  }

  // initiate it in your component OnInit
  ngOnInit(): void {
    this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        // console.log('session expired');
         
         const proceed = confirm('Your session is about to expire due to inactivity. To continue using the application, please click the "Cancel" button below.');

         if (!proceed) {
          this.bnIdle.resetTimer(300);
         } else {
          this.logout.logout()
          this.bnIdle.stopTimer();
         }
      }
    });
  }

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
