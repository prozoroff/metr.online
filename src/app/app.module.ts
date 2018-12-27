import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './chart/chart.component';
import { AboutComponent } from './about/about.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { DescriptionComponent } from './description/description.component';
import { ApiService } from './shared';
import { DataService } from './data.service';
import { routing } from './app.routing';

import { BsModalModule } from 'ng2-bs3-modal';

@NgModule({
  imports: [
    BrowserModule,
    ChartModule.forRoot(require('highcharts')),
    HttpClientModule,
    FormsModule,
    routing,
    BsModalModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ChartComponent,
    AboutComponent,
    CalculatorComponent,
    ComparisonComponent,
    DescriptionComponent
  ],
  providers: [
    ApiService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule{};
