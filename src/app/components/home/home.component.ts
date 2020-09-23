import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import {DataServiceService} from 'D:/angular_project/covid-tracker/src/app/services/data-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dataService:DataServiceService) { }

  loading=true;

  totalActive=0;
  totalConfirmed=0;
  totalDeaths=0;
  totalRecovered=0;
  globalData:GlobalDataSummary[];
  dataTable=[];

  chart={
    PieChart:"PieChart",
    ColumnChart:"ColumnChart",
    height:500,
    options:{
      animation:{
        duration:1000,
        easing:'out'
      },
      is3D: true,
    },
  }


  ngOnInit(): void {
      this.dataService.globalData()
      .subscribe(
        {
          next : (result)=>{
            console.log(result);
            this.globalData=result;

            result.forEach(cs=>{
              this.totalActive+=cs.active;
              this.totalConfirmed+=cs.confirmed;
              this.totalDeaths+=cs.deaths;
              this.totalRecovered+=cs.recovered;
              console.log("active value below");
      
              console.log(this.totalActive);
            })
            
            this.initChart('c');           
          },
          complete:()=>{
            this.loading=false;
          }
        }
      );
      
      
  }

  initChart(caseType:string){

    this.dataTable=[];

    this.globalData.forEach(cs=>{
      let value:number;
      if(caseType=='c'){
        if(cs.confirmed>2000000)
          value=cs.confirmed;
      }
      if(caseType=='a'){
        if(cs.active>500000)
          value=cs.active;
      }
      if(caseType=='r'){
        if(cs.recovered>50000)
          value=cs.recovered;
      }
      if(caseType=='d'){
        if(cs.deaths>50000)
          value=cs.deaths;
      }
      
     this.dataTable.push([cs.country,value]);
    })
  }

  updateChart(cases:HTMLInputElement){
    console.log(cases.value);
    this.initChart(cases.value);
  }
}   
