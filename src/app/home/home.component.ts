import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { ApiService } from '../shared';
import { Location } from '@angular/common';

const tenDaysStep = 10 * 3600 * 1000 * 24;

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  averageOptions: any;
  meterOptions: any;
  priceByDistrictOptions: any;
  volumeByDistrictOptions: any;
  priceByConstructionTypeOptions: any;
  roomCountOptions: any;
  title: string;

  charts: any;

  constructor(private api: ApiService, private dataService: DataService, private location: Location) {
    this.api.cityChanged.subscribe(() => { this.refresh(); });
  };

  refresh() {

    this.location.replaceState('overview?city=' + this.api.currentCity.id);

    this.title = 'Анализ рынка недвижимости в ' + this.api.currentCity.nameRod;
    this.dataService.init(this.api.currentCity.id);

    this.charts = [];

    this.dataService.getAveragePrice().subscribe(average => {
      const timeValues = getTimeValues(
        parseDate(average.date),
        tenDaysStep,
        average.data.length
      ),
        roomData = [0, 1, 2].map(i => average.data.map((item, ind) => [timeValues[ind], item[i]]));

      this.charts.push({
        blockTitle: 'Средняя цена квартиры',
        description: average.desc,
        right: true,
        title: 'none',
        xAxis: {
          type: 'datetime',
          labels: {
            style: {
              fontSize: '14px',
              fontFamily: 'Arial, Helvetica, sans-serif'
            },
            format: '{value: %d.%m.%y}'
          }
        },
        yAxis: {
          title: {
            text: 'Стоимость, млн. руб.',
            style: {
              fontSize: '14px',
              fontFamily: 'Arial, Helvetica, sans-serif'
            },
          },
          labels: {
            style: {
              fontSize: '14px',
              fontFamily: 'Arial, Helvetica, sans-serif'
            },
            formatter: function () {
              return (this.value / 1000000).toFixed(2);
            }
          }
        },
        series: [
          { data: roomData[0], name: 'Однокомнатные' },
          { data: roomData[1], name: 'Двухкомнатные' },
          { data: roomData[2], name: 'Трехкомнатные' }
        ]
      });
    });

    this.dataService.getMeterPrice().subscribe(meter => {
      const timeValues = getTimeValues(
        parseDate(meter.date),
        tenDaysStep,
        meter.data.length
      ),
        meterData = meter.data.map((item, ind) => [timeValues[ind], average(item)]);

      meterData.pop();

      this.charts.push({
        blockTitle: 'Средняя цена квадратного метра',
        description: meter.desc,
        title: 'none',
        xAxis: {
          type: 'datetime',
          labels: {
            style: { fontSize: '14px' },
            format: '{value: %d.%m.%y}'
          }
        },
        yAxis: {
          title: { text: 'Стоимость, тыс. руб.', style: { fontSize: '14px' } },
          labels: {
            style: { fontSize: '14px' },
            formatter: function () {
              return (this.value / 1000).toFixed(2);
            }
          }
        },
        series: [
          { data: meterData, name: 'Квадратный метр' }
        ]
      })
    });

    this.dataService.getPriceByDistrict().subscribe(priceByDistrict => {

      const data = priceByDistrict.data,
        priceData = Object.keys(data).map(name => [name, data[name]]).
          sort((a, b) => { return a[1] > b[1] ? 1 : -1; })

      let maxDist = 0,
        minDist = 0,
        priceByDistrictResult = [];

      for (let i = 0, l = priceData.length; i < l; i++) {
        const priceByDist = priceData[i][1];
        if (!maxDist || priceByDist > maxDist) {
          maxDist = priceByDist;
        };
        if (!minDist || priceByDist < minDist) {
          minDist = priceByDist;
        };
        if (priceByDistrictResult.length < 5 || i > l - 5) {
          priceByDistrictResult.push(priceData[i]);
        }
        if (priceByDistrictResult.length === 5 && l > 10) {
          priceByDistrictResult.push(['~', 0]);
        }
      }

      this.charts.push({
        blockTitle: 'Средняя цена квадратного метра по районам города',
        description: priceByDistrict.desc,
        title: 'none',
        chart: {
          type: 'column'
        },
        xAxis: {
          labels: { style: { fontSize: '14px' } },
          type: 'category'
        },
        yAxis: {
          title: { text: 'Стоимость, тыс. руб.', style: { fontSize: '14px' }, },
          min: minDist * .8,
          max: maxDist * 1.2,
          labels: {
            style: { fontSize: '14px' },
            formatter: function () {
              return (this.value / 1000).toFixed(2);
            }
          }
        },
        series: [
          { data: priceByDistrictResult, name: 'Квадратный метр' }
        ]
      })
    });


    // //volume by district
    // ///////////////////////////////////////////////////////////////

    // let volumeByDistrict = this.dataService.getVolumeByDistrict().sort((a, b) => a[1] < b[1] ? 1 : -1),
    //   data = [],
    //   rest = 0;

    // volumeByDistrict.map(item => {
    //   if (data.length < 15) {
    //     data.push({
    //       name: item[0],
    //       y: item[1]
    //     });
    //   }
    //   else {
    //     rest += item[1];
    //   }
    // });

    // if (rest > 0) {
    //   data.push({
    //     name: 'Остальные',
    //     y: rest
    //   });
    // }

    // this.volumeByDistrictOptions = {
    //   blockTitle: 'Объем предложения на рынке по районам',
    //   description: this.dataService.getVolumeByDistrictDesc(),
    //   right: true,
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: null,
    //     plotShadow: false,
    //     type: 'pie'
    //   },
    //   title: 'none',
    //   tooltip: {
    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       dataLabels: {
    //         enabled: true,
    //         format: '<b>{point.name}</b>: {point.percentage:.1f} %',
    //         style: {
    //           fontSize: '1.2em',
    //           color: 'black'
    //         }
    //       }
    //     }
    //   },
    //   series: [{
    //     name: 'Доля',
    //     colorByPoint: true,
    //     data: data
    //   }]
    // };

    // //price by construction type
    // ///////////////////////////////////////////////////////////////

    // let priceByConstructionType = this.dataService.getPriceByConstructionType();

    // this.priceByConstructionTypeOptions = {
    //   blockTitle: 'Средняя цена квадратного метра в зависимости от типа постройки',
    //   description: this.dataService.getPriceByConstructionTypeDesc(),
    //   right: true,
    //   title: 'none',
    //   chart: {
    //     type: 'column'
    //   },
    //   xAxis: {
    //     type: 'category',
    //     labels: { style: { fontSize:'14px' } }
    //   },
    //   yAxis: {
    //     title: { text: 'Стоимость, тыс. руб.', style: { fontSize:'14px' }, },
    //     labels: {
    //       style: { fontSize:'14px' },
    //       formatter: function () {
    //         return (this.value / 1000).toFixed(2);
    //       }
    //     }
    //   },
    //   series: [
    //     { data: priceByConstructionType, name: 'Квадратный метр' }
    //   ]
    // };


    // //room count ratio
    // ///////////////////////////////////////////////////////////////

    // let roomCount = this.dataService.getRoomCountRatio();

    // this.roomCountOptions = {
    //   blockTitle: 'Соотношение предложений на рынке по числу комнат',
    //   description: this.dataService.getRoomCountRatioDesc(),
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: null,
    //     plotShadow: false,
    //     type: 'pie'
    //   },
    //   title: 'none',
    //   tooltip: {
    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       dataLabels: {
    //         enabled: true,
    //         format: '<b>{point.name}</b>: {point.percentage:.1f} %',
    //         style: {
    //           fontSize:'14px',
    //           color: 'black'
    //         }
    //       }
    //     }
    //   },
    //   series: [{
    //     name: 'Доля',
    //     colorByPoint: true,
    //     data: [{
    //       name: 'Однокомнатные',
    //       y: roomCount[0]
    //     }, {
    //       name: 'Двухкомнатные',
    //       y: roomCount[1]
    //     }, {
    //       name: 'Трехкомнатные',
    //       y: roomCount[2]
    //     }]
    //   }]
    // };

    // this.charts = [];

    // this.charts.push(this.allCharts.pop());
    // this.charts.push(this.allCharts.pop());
    // this.charts.push(this.allCharts.pop());
    // this.charts.push(this.allCharts.pop());

  }

  // onScrollDown() {
  //   if (this.allCharts.length) {
  //     this.charts.push(this.allCharts.pop());
  //   }
  // }

}

function parseDate(dateStr: string): Date {
  const parts = dateStr.split('/').map(item => parseInt(item));
  return new Date(parts[2], parts[1], parts[0]);
}

function average(arr: Array<number>): number {
  return arr.reduce(function (a, b) { return a + b; }) / arr.length;
}

function getTimeValues(date: any, step: number, count: number): Array<number> {
  return new Array(count).fill(0).map((item, ind) => date - step * ind);
}