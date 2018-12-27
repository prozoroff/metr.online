import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';

@Injectable()
export class PriceService {
  constructor (
    private http: HttpClient
  ) {}

  get() {
    return this.http.get(`http://localhost:8088/`)
    //.map(response => response.json());
  }

  post(data: any) {
    return this.http.post(`http://localhost:8088/`, data)
    //.map(response => response.json());
  }

}
