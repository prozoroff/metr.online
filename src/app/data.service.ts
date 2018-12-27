import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

    private city: string;
    private average_price: any;
    private room_count_ratio: any;
    private average_price_by_meter: any;
    private price_by_district: any;
    private volume_by_district: any;
    private price_by_construction_type: any;

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

        // this.loadData('average_price', this.city);
        // this.loadData('room_count_ratio', this.city);
        // this.loadData('average_price_by_meter', this.city);
        // this.loadData('price_by_district', this.city);
        // this.loadData('price_by_construction_type', this.city);
        // this.loadData('price_by_district', this.city);
        // this.loadData('volume_by_district', this.city);
        // this.loadData('price_by_construction_type', this.city);

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

    loadData(dataId: string, cityId?: string) {
        return this.loadJSON(dataId, cityId);
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
        return this.loadData('average_price', this.city);
    }

    getLastDate(): any {
        const date = this.average_price.date.split('/').map(item => parseInt(item));
        return new Date(date[2], date[1], date[0]);
    }

    getRoomCountRatio(): any {
        return this.room_count_ratio.data;
    }
    getRoomCountRatioDesc(): any {
        return this.room_count_ratio.desc;
    }

    getMeterPrice(): any {
        return this.loadData('average_price_by_meter', this.city);
    }

    getPriceByDistrict(): any {
        return this.loadData('price_by_district', this.city);
    }

    getVolumeByDistrict(): any {
        const data = this.volume_by_district.data,
            keys = Object.keys(data);

        let result = [];

        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            result.push([key, data[key]]);
        }

        return result.sort((a, b) => { return a[1] > b[1] ? 1 : -1; });
    }
    getVolumeByDistrictDesc(): any {
        return this.volume_by_district.desc;
    }

    getPriceByConstructionType(): any {
        const data = this.price_by_construction_type.data,
            keys = Object.keys(data),
            accuracyFactor = 100;

        let result = [];

        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            result.push([key, Math.round(data[key] / accuracyFactor) * accuracyFactor]);
        }

        return result.sort((a, b) => { return a[1] > b[1] ? 1 : -1; });
    }
    getPriceByConstructionTypeDesc(): any {
        return this.price_by_construction_type.desc;
    }

    getDistricts(): any {
        const data = this.price_by_district.data;
        return Object.keys(data);
    }

    getConstructionTypes(): any {
        const data = this.price_by_construction_type.data;
        return Object.keys(data);
    }

}