import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiService } from './shared';
import { Router } from '@angular/router';

const cityRegex = /\?city=(.*)/;

@Component({
  selector: 'my-app', 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('selectModal')
  selectModal: BsModalComponent;

  url = 'https://github.com/preboot/angular2-webpack';
  title: string;
  selectedCity: any;
  cities: Array<any>;

  processUrl = true;

  private sub: any;
  citiesToSelect;

  cityChanged(city?) {

    if (city) {
      this.selectedCity = city;
    }

    this.api.changeCurrentCity(this.selectedCity);
  }

  constructor(private api: ApiService, private router: Router, ) {
    this.cities = this.api.cities;
    this.selectedCity = this.api.currentCity;
    this.title = this.api.title;
    window.onresize = this.setFooterSize;
    window.onload = this.setFooterSize;
  }
  
  setFooterSize(){
    const footer = document.getElementsByTagName('footer')[0],
      content = document.getElementsByClassName('footer_cities')[0],
      contentHeight = content['offsetHeight'] + 40;
    footer.style.height = contentHeight + 'px';
  }

  ngOnInit() {

    this.router.events.subscribe(event => {
      //debugger;

      if (!this.processUrl) {
        return;
      }

      const url = event['url'];
      if(url){
      const match = cityRegex.exec(url),
        cityId = match ? match[1] : null;

      if (cityId) {
        const city = this.api.getCityById(cityId);
        if (city) {
          this.cityChanged(city);
        }
      } else if (!this.api.currentCity) {
        this.citiesToSelect = [];

        const half = Math.ceil(this.api.cities.length / 2);
        for (let i = 0, l = this.api.cities.length; i < l; i++) {
          this.citiesToSelect[i < half ? i * 2 : ((i - half) * 2 + 1)] = this.api.cities[i];
        }
        this.processUrl = false;
        this.selectModal.open();
      } 
      }
    });
  }

  modalResult(city) {
    this.cityChanged(city);
    this.selectModal.close();
    this.processUrl = true;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
