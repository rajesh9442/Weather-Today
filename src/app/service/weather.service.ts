import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apikey='cb33515f6cmsh7850533a66eb0bcp11ed46jsn3fb718d9d2ff';
  private apiurl='https://weather338.p.rapidapi.com/locations/search';
  constructor(private http:HttpClient) { }
  searchWeatherByCity(city:String):Observable<any>{
    const headers = new HttpHeaders()
    .set("X-RapidAPI-Key",this.apikey)
    .set("X-RapidAPI-Host", "the-weather-api.p.rapidapi.com")

    const options = {headers};
    return this.http.get(`${this.apiurl}/${city}`,options);

  }
}
