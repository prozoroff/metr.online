import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ApiService {
  title = 'Angular 2';
  cities: Array<any> = [
    { name: 'Москва', id: 'moskva', nameRod: 'Москве' },
    { name: 'Санкт-Петербург', id: 'sankt-peterburg', nameRod: 'Санкт-Петербурге' },
    { name: 'Казань', id: 'kazan', nameRod: 'Казани' },
    { name: 'Новосибирск', id: 'novosibirsk', nameRod: 'Новосибирске' },
    { name: 'Екатеринбург', id: 'ekaterinburg', nameRod: 'Екатеринбурге' },
    { name: 'Нижний Новгород', id: 'nizhniy_novgorod', nameRod: 'Нижнем Новгороде' },
    { name: 'Ростов-на-Дону', id: 'rostov-na-donu', nameRod: 'Ростове-на-Дону' },
    { name: 'Воронеж', id: 'voronezh', nameRod: 'Воронеже' },
    { name: 'Челябинск', id: 'chelyabinsk', nameRod: 'Челябинске' },
    { name: 'Красноярск', id: 'krasnoyarsk', nameRod: 'Красноярске' },
    { name: 'Ульяновск', id: 'ulyanovsk', nameRod: 'Ульяновске' },
    { name: 'Самара', id: 'samara', nameRod: 'Самаре' },
    { name: 'Уфа', id: 'ufa', nameRod: 'Уфе' },
    { name: 'Пермь', id: 'perm', nameRod: 'Перми' },
    { name: 'Краснодар', id: 'krasnodar', nameRod: 'Краснодаре' },
    { name: 'Ярославль', id: 'yaroslavl', nameRod: 'Ярославле' },
    { name: 'Иваново', id: 'ivanovo', nameRod: 'Иванове' },
    { name: 'Вологда', id: 'vologda', nameRod: 'Вологде' },
    { name: 'Владимир', id: 'vladimir', nameRod: 'Владимире' },
    { name: 'Кострома', id: 'kostroma', nameRod: 'Костроме' },
    { name: 'Тверь', id: 'tver', nameRod: 'Твери' },
    { name: 'Рязань', id: 'ryazan', nameRod: 'Рязани' },
    { name: 'Тула', id: 'tula', nameRod: 'Туле' },
    { name: 'Калуга', id: 'kaluga', nameRod: 'Калуге' },
    { name: 'Пермь', id: 'perm', nameRod: 'Перми' },
    { name: 'Саратов', id: 'saratov', nameRod: 'Саратове' },
    { name: 'Волгоград', id: 'volgograd', nameRod: 'Волгограде' },
    { name: 'Барнаул', id: 'barnaul', nameRod: 'Барнауле' },
    { name: 'Хабаровск', id: 'habarovsk', nameRod: 'Хабаровске' },
    { name: 'Иркутск', id: 'irkutsk', nameRod: 'Иркутске' },
    { name: 'Ижевск', id: 'izhevsk', nameRod: 'Ижевске' },
    { name: 'Омск', id: 'omsk', nameRod: 'Омске' },
    { name: 'Сочи', id: 'sochi', nameRod: 'Сочи' },
    { name: 'Тольятти', id: 'tolyatti', nameRod: 'Тольятти' },
    { name: 'Тюмень', id: 'tyumen', nameRod: 'Тюмени' },
    { name: 'Владивосток', id: 'vladivostok', nameRod: 'Владивостоке' }
  ];
  citiesLookup: any = this.getCitiesLookup();

  currentCity;

  cityChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    //this.getCurrentCity();
  }

  changeCurrentCity(city) {
    this.currentCity = city;
    this.cityChanged.emit(this.currentCity);
  }

  changeCurrentCityById(cityId) {

    const city = this.getCityById(cityId);
    if (city) {
      this.currentCity = city;
      this.cityChanged.emit(this.currentCity);
    }
  }

  getCityById(cityId) {
    for (let i = 0, l = this.cities.length; i < l; i++) {
      const city = this.cities[i];
      if (city.id === cityId) {
        return city;
      }
    }
  }

  setDefaultCity() {
    this.cityChanged.emit(this.currentCity);
  }

  getCurrentCity() {
    const ymaps = window['ymaps'],
      cities = this.cities,
      self = this;
    if (ymaps) {
      ymaps.ready(function () {
        const city = ymaps.geolocation.city;
        self.changeCurrentCity(cities.find(item => item.name === city));
      });
    }
  }

  getCitiesLookup() {

    if (!this.citiesLookup) {
      this.citiesLookup = {};
      this.cities.map(city => {
        this.citiesLookup[city.id] = city.name;
      });
    }

    return this.citiesLookup;
  }
}
