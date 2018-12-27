import { Component, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { ApiService } from '../shared';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Location } from '@angular/common';

@Component({
    selector: 'my-comparison',
    templateUrl: './comparison.component.html',
    styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent {

    averagePriceChart: any;
    averageMeterChart: any;
    cities: any;
    citiesToCompare: any;
    citiesToSelect: any;
    citiesString: string;
    selectAllValue = false;

    citiesGroups: any = [
        ['moskva', 'yaroslavl', 'ivanovo', 'vladimir', 'kostroma', 'ryazan', 'tula', 'kaluga'],
        ['sankt-peterburg', 'perm', 'vologda', 'tver', 'izhevsk'],
        ['kazan', 'nizhniy_novgorod', 'ulyanovsk', 'ufa', 'saratov', 'volgograd', 'tolyatti', 'samara'],
        ['novosibirsk', 'ekaterinburg', 'chelyabinsk', 'krasnoyarsk', 'barnaul', 'omsk', 'tyumen'],
        ['rostov-na-donu', 'voronezh', 'krasnodar', 'sochi'],
        ['habarovsk', 'irkutsk', 'vladivostok']
    ];


    @ViewChild('selectModal')
    selectModal: BsModalComponent;

    citiesClick() {
        this.selectModal.open();
    }

    modalResult(city) {
        const ind = this.citiesToCompare.indexOf(city);
        if (ind > -1) {
            this.citiesToCompare.splice(ind, 1);
        } else {
            this.citiesToCompare.push(city);
        }
    }

    selectAll() {
        this.citiesToCompare = [];
        this.selectAllValue = !this.selectAllValue;
        if (this.selectAllValue) {
            this.citiesToSelect.map(city => this.citiesToCompare.push(city));
        }
    }

    modalClose(modal) {
        modal.close();
        this.refresh();
    }

    needCompare(city) {
        for (let i = 0, l = this.citiesToCompare.length; i < l; i++) {
            if (this.citiesToCompare[i].id === city) {
                return true;
            }
        }
        return false;
    }

    constructor(private api: ApiService, private dataService: DataService, private location: Location) {
        
        if (this.api.currentCity) {
            this.refresh();
        }

        this.api.cityChanged.subscribe(() => { this.refresh(); });

    }

    refresh() {
        this.dataService.init(this.api.currentCity.id);
        
        this.location.replaceState('comparison?city=' + this.api.currentCity.id);
        
        this.cities = this.api.getCitiesLookup();
        this.citiesToSelect = Object.assign(this.api.cities);
        
        if(!this.citiesToCompare){
        this.citiesToCompare = [];

         if (this.api.currentCity) {
            let group;

            for (let i = 0, l = this.citiesGroups.length; i < l; i++) {
                if (this.citiesGroups[i].indexOf(this.api.currentCity.id) > -1) {
                    group = this.citiesGroups[i];
                    break;
                }
            }

            this.citiesToSelect.map(city => {
                if (group.indexOf(city.id) > -1) {
                    this.citiesToCompare.push(city);
                }
            });


        } else {
            this.citiesToSelect.map(city => this.citiesToCompare.push(city));
        }
        }

        this.citiesString = this.citiesToCompare.map(city => city.name).join(', ');

        let averagePriceComparison = this.dataService.getAveragePriceComparson(),
            series = [{
                name: '1-комнатные',
                data: []
            }, {
                name: '2-комнатные',
                data: []
            }, {
                name: '3-комнатные',
                data: []
            }],
            categories = [];

        averagePriceComparison.sort((a, b) => {
            if (a[1][1] > b[1][1]) {
                return 1;
            } else {
                return -1;
            }
        });

        for (let i = 0; i < averagePriceComparison.length; i++) {
            const item = averagePriceComparison[i];
            if (this.needCompare(item[0])) {
                series[0].data.push(item[1][0]);
                series[1].data.push(item[1][1]);
                series[2].data.push(item[1][2]);
                categories.push(this.cities[item[0]]);
            }
        }

        this.averagePriceChart = {
            title: { text: 'Средняя стоимость квартиры' },
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category',
                labels: { style: { fontSize:'14px' } },
                categories
            },
            yAxis: {
                title: { text: 'Стоимость, млн. руб.', style: { fontSize:'14px' } },
                labels: {
                    style: { fontSize:'14px' },
                    formatter: function () {
                        return (this.value / 1000000).toFixed(2);
                    }
                }
            },
            series
        };

        let allMeterComparisons = this.dataService.getAverageMeterComparson(),
            averageMeterComparison = [],
            meterTitles = [];

        for (let i = 0, l = allMeterComparisons.length; i < l; i++) {
            const item = allMeterComparisons[i];
            if (this.needCompare(item[0])) {
                averageMeterComparison.push(item);
            }
        }

        averageMeterComparison.sort((a, b) => {
            if (a[1] > b[1]) {
                return 1;
            } else {
                return -1;
            }
        });

        for (let i = 0; i < averageMeterComparison.length; i++) {
            const item = averageMeterComparison[i];
            meterTitles.push(this.cities[item[0]]);
        }

        this.averageMeterChart = {
            title: { text: 'Средняя стоимость квадратного метра' },
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category',
                labels: { style: { fontSize:'14px' } },
                categories: meterTitles
            },
            yAxis: {
                title: { text: 'Стоимость, тыс. руб.', style: { fontSize:'14px' }  },
                labels: {
                    style: { fontSize:'14px' } ,
                    formatter: function () {
                        return Math.round(this.value / 1000);
                    }
                }
            },
            series: [
                { data: averageMeterComparison, name: 'Квадратный метр' }
            ]
        };
    }

}
