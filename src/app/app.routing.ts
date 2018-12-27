import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { ComparisonComponent } from './comparison/comparison.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'calculator', component: CalculatorComponent},
  { path: 'comparison', component: ComparisonComponent}
];

export const routing = RouterModule.forRoot(routes);
