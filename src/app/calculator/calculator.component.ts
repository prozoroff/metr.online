import { Component, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { PriceService } from '../price.service';
import { ApiService } from '../shared';
import { Location } from '@angular/common';

@Component({
    selector: 'my-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss'],
    providers: [PriceService]
})
export class CalculatorComponent {

    @ViewChild('selectModal')
    selectModal: BsModalComponent;

    @ViewChild('numberModal')
    numberModal: BsModalComponent;

    @ViewChild('radioModal')
    radioModal: BsModalComponent;

    changedParam: string;
    isEmpty = true;

    unitStr: any;
    range: any = [0, 0];

    square: number;
    floor: number;
    floorInBuilding: number;
    roomCount: number;
    constructionType: string;

    district: any;
    availableDistricts: any;

    rooms: any;
    constructionTypes: any;

    resultPrice: string;
    calculating: boolean;

    items: [any];
    result: any;

    title: string;
    pageTitle: string;
    description: string = '* данная величина стоимости квартиры является приблизительным значением, полученным ' +
    'с применением методов машинного обучения на основе анализа рынка недвижимости за последний месяц.';

    districtClick() {
        this.changedParam = 'district';
        this.items = this.availableDistricts;
        this.result = this.district;
        this.title = 'Район';
        this.selectModal.open();
    }

    constructionTypeClick() {
        this.changedParam = 'constructionType';
        this.items = this.constructionTypes;
        this.result = this.constructionType;
        this.title = 'Тип дома';
        this.selectModal.open();
    }

    squareClick() {
        this.range = [10, 100];
        this.unitStr = ' м²';
        this.changedParam = 'square';
        this.result = this.square;
        this.title = 'Площадь';
        this.numberModal.open();
    }

    floorClick() {
        this.range = [1, this.floorInBuilding];
        this.changedParam = 'floor';
        this.result = this.floor;
        this.title = 'Этаж';
        this.unitStr = '';
        this.numberModal.open();
    }

    floorInBuildingClick() {
        this.range = [1, 20];
        this.changedParam = 'floorInBuilding';
        this.result = this.floorInBuilding;
        this.title = 'Этажей в доме';
        this.unitStr = '';
        this.numberModal.open();
    }

    roomCountClick() {
        this.items = this.rooms;
        this.unitStr = '';
        this.changedParam = 'roomCount';
        this.result = this.roomCount;
        this.title = 'Число комнат';
        this.radioModal.open();
    }

    modalResult(result) {
        this[this.changedParam] = result || this.result;
        if (this.floor > this.floorInBuilding) {
            this.floor = this.floorInBuilding;
        }
    }

    modalClose(modal) {
        modal.close();
        this.calculate();
    }

    calculate() {
        const postData = [
            this.square,
            this.district,
            this.roomCount,
            this.floor,
            this.floorInBuilding,
            this.constructionType,
            this.api.currentCity.id
        ].join('$');
        this.calculating = true;
        this.priceService.post(postData).subscribe(
            data => {
                this.resultPrice = this.toReadable(data['price']);
                this.calculating = false;
            });
    }

    constructor(
        private api: ApiService,
        private dataService: DataService,
        private priceService: PriceService,
        private location: Location) {

        if (this.api.currentCity) {
            this.refresh();
        }

        this.api.cityChanged.subscribe(() => { this.refresh(); });
    }

    refresh() {

        this.location.replaceState('calculator?city=' + this.api.currentCity.id);

        this.pageTitle = 'Расчет стоимости квартиры в ' + this.api.currentCity.nameRod;

        this.dataService.init(this.api.currentCity.id);
        this.availableDistricts = this.dataService.getDistricts().sort();
        this.district = this.availableDistricts[this.random(1, this.availableDistricts.length)];
        this.roomCount = this.random(1, 3);
        this.square = this.random(10, 30) + this.roomCount * this.random(10, 30);
        this.floor = this.random(1, 9);;
        this.floorInBuilding = 9;
        this.range = [1, 20];
        this.rooms = [{
            val: 1,
            desc: '1-комнатная'
        }, {
            val: 2,
            desc: '2-комнатная'
        }, {
            val: 3,
            desc: '3-комнатная'
        }];
        this.constructionTypes = this.dataService.getConstructionTypes();
        this.constructionType = this.constructionTypes[this.constructionTypes.length - 1];
        this.calculate();
    }

    toReadable(price: number) {
        const mlns = Math.floor(price / 1000000),
            price_m = price % 1000000,
            thsnds = (Math.abs(Math.floor(price_m / 1000)) + '000').slice(0, 3);

        return (mlns ? mlns + '.' : '') + thsnds + '.000 р.';
    }

    random(min, max) {
        return min + Math.round((max - min) * Math.random());
    }
}
