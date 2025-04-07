import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WeatherResponse {
  data: {
    temp: number;
    expected_temp: number;
    humidity: number;
    wind: number;
  };
}

/**
 * Service responsible for fetching weather data from the RapidAPI weather service
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly _apiurl = 'https://the-weather-api.p.rapidapi.com/api/weather';

  constructor(private readonly _http: HttpClient) {}

  /**
   * Fetches weather data for a specific city
   * @param city - The name of the city to fetch weather data for
   * @returns Observable of WeatherResponse or error object
   */
  searchWeatherByCity(city: string): Observable<WeatherResponse> {
    const headers = new HttpHeaders()
      .set('X-RapidAPI-Key', environment.rapidApiKey ?? '')
      .set('X-RapidAPI-Host', 'the-weather-api.p.rapidapi.com');

    const options = { headers };
    
    // Log the API call for monitoring
    console.log(`Fetching weather data for city: ${city}`);

    return this._http.get<WeatherResponse>(`${this._apiurl}/${encodeURIComponent(city)}`, options).pipe(
      catchError(this._handleError)
    );
  }

  /**
   * Handles HTTP errors
   * @param error - The HTTP error response
   * @returns Observable with error message
   */
  private _handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
