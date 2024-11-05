import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherserviceService {

  private apiKey: string = 'a14fc504bf36e1a558f926f126191f47'; // Replace with your API key
  private weatherApiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastApiUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) { }

  getWeather(location: any, units: any): Observable<any> {
    return this.http.get(this.weatherApiUrl + "?q=" + location + "&appid=" + this.apiKey + "&units=" + units)
      .pipe(catchError(error =>
        throwError(() => error)
      ));
  }

  getForecast(lat: any, long: any, units: any): Observable<any> {
    return this.http.get(this.forecastApiUrl + "?lat=" + lat + "&lon=" + long + "&appid=" + this.apiKey + "&units=" + units)
      .pipe(catchError(error =>
        throwError(() => error)
      ));
  }


  getWeatherbasedonCoordinates(lat: string, long: string, units: any) {
    return this.http.get(this.weatherApiUrl + "?lat=" + lat + "&lon=" + long + "&appid=" + this.apiKey + "&units=" + units)
      .pipe(catchError(error =>
        throwError(() => error)
      ));

  }

}
