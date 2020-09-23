import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalDataSummary} from '../models/global-data';
import {DateWiseData} from '../models/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/09-20-2020.csv";

  private dataWiseDataUrl="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
  
  // private extension=".csv";
  // month;
  // date;
  // year;

  constructor(private http:HttpClient) { 
    // let date=new Date();
    // this.month=date.getMonth() + 1;
    // this.date=date.getDate();
    // this.year=date.getFullYear();
    // console.log({
    //   date:this.date,
    //   month:this.month,
    //   year:this.year
    // });

    // this.globalDataUrl=`${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`
    // console.log(this.globalDataUrl);
    
  }

  getDate(date:number){
    if(date<10){
      return '0'+date;
    }
    return date;
  }

  dataWiseData(){
   return this.http.get(this.dataWiseDataUrl,{responseType:"text"}).
   pipe(map(result=>{
     let rows=result.split("\n");
     let header=rows[0];
     let dates=header.split(/,(?=\S)/);
     dates.splice(0,4);
     rows.splice(0,1);

     let mainData={};
     
     rows.forEach(row=>{
       let cols=row.split(/,(?=\S)/);
       let country=cols[1];
       cols.splice(0,4);
       mainData[country]=[];

       cols.forEach((value,index)=>{
         let dw:DateWiseData={
           country:country,
           cases:+value,
           date:new Date(Date.parse(dates[index]))
         }
         mainData[country].push(dw);
         
       })
       
     })
     return mainData;
     
    
     
   }));
  }

  globalData(){
   return this.http.get(this.globalDataUrl, {responseType:'text'}).pipe(
     map(result=>{

    let data:GlobalDataSummary[]=[];
    const rows=result.split('\n');
    let raw={};

    rows.splice(0,1);

    rows.forEach(row=>{
       let col= row.split(/,(?=\S)/);

       let cs={
          country:col[3],
         confirmed:+col[7],
         deaths: +col[8],
         recovered: +col[9],
         active: +col[10]
        };
        let temp:GlobalDataSummary=raw[cs.country];
        if(temp){
          temp.active=cs.active + temp.active;
          temp.confirmed=cs.confirmed + temp.confirmed;
          temp.deaths=cs.deaths + temp.deaths;
          temp.recovered=cs.recovered + temp.recovered;
          raw[cs.country]=temp;
        }else{
          raw[cs.country]=cs;
        }
  
     })
    //  console.log(raw);
     
      return <GlobalDataSummary[]>Object.values(raw);
      
    })
    
    )

  }
}
