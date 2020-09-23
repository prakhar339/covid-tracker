import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { count,map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  constructor(private dataService:DataServiceService) { }

  data:GlobalDataSummary[];
  countries:string[]=[];

  totalActive=0;
  totalConfirmed=0;
  totalDeaths=0;
  totalRecovered=0;
  selectedCountryData:DateWiseData[];
  dateWiseData;
  dataTable=[];
  loading=true;

  chart={
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

    merge(
      this.dataService.dataWiseData().pipe(
        map(result=>{
          this.dateWiseData=result;
        })
      ),
      this.dataService.globalData().pipe(
        map(result=>{
          this.data=result;
          this.data.forEach(cs=>{
            this.countries.push(cs.country);
          })
        })
      )
    ).subscribe(
      {
        complete:()=>{
          this.updateValue("India");
          this.loading=false;
        }
      }
    )

  }

  updateValue(country:string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country===country){
        this.totalRecovered=cs.recovered;
        this.totalDeaths=cs.deaths;
        this.totalActive=cs.active;
        this.totalConfirmed=cs.confirmed;
        console.log("countries active value below");
      
              console.log(this.totalActive);
      }
    })

    this.selectedCountryData=this.dateWiseData[country];
    this.updateChart();
    
  }

  updateChart(){
   this.dataTable=[];
    this.dataTable.push(["Date","Cases"]);
    this.selectedCountryData.forEach(cs=>{
      this.dataTable.push([cs.date,cs.cases])
    })
  }

}
