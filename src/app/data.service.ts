import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

    private city: string;
    private average_price: any;
    private room_count_ratio: any;

    private average_price_comparison: any;
    private average_meter_comparison: any;

    constructor(private http: HttpClient){}

    init(city?: string) {

        if (!city) {
            return;
        }

        if (this.city === city) {
            return;
        }

        this.city = city;

        // this.loadData('average_price_comparison');
        // this.loadData('average_meter_comparison');
    }

    loadJSON(dateId: string, city?: string, ) {

        let path = './assets/data/';

        if (city) {
            path += city + '/';
        }

        path += dateId + '.json';

        return this.http.get(path);
    }

    loadData(dataId: string) {
        return this.loadJSON(dataId, this.city);
    }

    getAveragePriceComparson(): any {
        const data = this.average_price_comparison,
            keys = Object.keys(data);

        let result = [];

        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            result.push([key, data[key]]);
        }

        return result;
    }

    getAverageMeterComparson(): any {
        const data = this.average_meter_comparison,
            keys = Object.keys(data);

        let result = [],
            accuracyFactor = 100;

        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            result.push([key, Math.round(data[key].reduce((a, b) => a + b, 0) / (data[key].length * accuracyFactor)) * accuracyFactor]);
        }

        return result;
    }

    getAveragePrice(): any {
        return this.loadData('average_price');
    }

    getRoomCountRatio(): any {
        return this.loadData('room_count_ratio');
    }

    getMeterPrice(): any {
        return this.loadData('average_price_by_meter');
    }

    getPriceByDistrict(): any {
        return this.loadData('price_by_district');
    }

    getVolumeByDistrict(): any {
        return this.loadData('volume_by_district');
    }

    getPriceByConstructionType(): any {
        return this.loadData('price_by_construction_type');
    }

}