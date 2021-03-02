import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private globalDataUrl='https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-01-2021.csv';

  constructor(private http: HttpClient) { }

  getGlobalData(){

    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(map(
      (result) =>{
        let data: GlobalDataSummary[] = [];
        let rows= result.split('\n');
        rows.splice(0,1);
        let raw: any={};
        // console.log(rows)
        for(let row of rows){

          let col=row.split(/,(?=\S)/);
          let cd={

            country:col[3],
            confirmed:+col[7],
            active:+col[10],
            recovered:+col[9],
            deaths:+col[8]

          };
          let temp=raw[cd.country];

          if(temp){
            temp.confirmed+=cd.confirmed;
            temp.active+=cd.active;
            temp.recovered+=cd.recovered;
            temp.deaths+=cd.deaths;
          }
          else
            raw[cd.country]=cd;
        }
        // console.log(raw)
        return <GlobalDataSummary[]>Object.values(raw);
      }
    ));

  }
}
