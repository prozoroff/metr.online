import { Component, Input } from '@angular/core';

@Component({
    selector: 'my-chart',
    styles: [`chart {
        display: block;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 30px;
      }`],
    templateUrl: './chart.component.html',
})
export class ChartComponent {
    @Input() options: any;

    constructor() {
    }
}
