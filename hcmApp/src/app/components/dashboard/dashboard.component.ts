import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  users: any
  emp: any
  exits: any
  units: any
  chartData: any
  chartUnit: string[] = []
  chartNo: number[] = []


  constructor ( private breadcrumb: BreadcrumbService, private http: HttpClient) {
    this.breadcrumb.setPageDetails('Dashboard','','','')

    this.getDashboardVals()

  }


  getDashboardVals(){
    //Users
    this.http.get("http://localhost:8089/count/users").subscribe((results: any) => {
      this.users = results.data
    })

    //Emp
    this.http.get("http://localhost:8089/count/employees").subscribe((results: any) => {
      this.emp =  results.data
    })
    //Exits
    this.http.get("http://localhost:8089/count/exits").subscribe((results: any) => {
      this.exits =  results.data
    })
    //units
    this.http.get("http://localhost:8089/count/units").subscribe((results: any) => {
      this.units =  results.data
    })
  }



  ngAfterViewInit(): void {
    this.http.get("http://localhost:8080/api/chartVal").subscribe((results: any) => {
      this.chartData = results.data

      for (let i = 0; i < this.chartData.length; i++) {
        this.chartUnit.push(this.chartData[i].Name)
        this.chartNo.push(this.chartData[i].unitNumber)
      }

      const x = Object.values(this.chartUnit)
      const y = Object.values(this.chartNo)
      
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: x,
          datasets: [{
            label: 'Employee Count by Department',
            data: y,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                stepSize: 1 // set the step size to 1
              }
            }
          }
        }
      });
      
    }) 

   
  }

}
