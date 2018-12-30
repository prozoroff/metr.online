import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

    private city: string;

    constructor(private http: HttpClient){}

    init(city?: string) {
        if (!city || this.city === city) return;
        this.city = city;
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

    getAveragePriceComparison(): any {
        return this.loadData('average_price_comparison');
    }

    getAverageMeterComparson(): any {
        return this.loadData('average_meter_comparison');
    }

    getAveragePrice(): any {
        return this.loadData('average_price', this.city);
    }

    getRoomCountRatio(): any {
        return this.loadData('room_count_ratio', this.city);
    }

    getMeterPrice(): any {
        return this.loadData('average_price_by_meter', this.city);
    }

    getPriceByDistrict(): any {
        return this.loadData('price_by_district', this.city);
    }

    getVolumeByDistrict(): any {
        return this.loadData('volume_by_district', this.city);
    }

    getPriceByConstructionType(): any {
        return this.loadData('price_by_construction_type', this.city);
    }

}