import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

export interface WeatherResponse {
  success: boolean;
  data: {
    city: string;
    current_weather: string;
    temp: string;
    expected_temp: string;
    insight_heading: string;
    insight_description: string;
    wind: string;
    humidity: string;
    visibility: string;
    uv_index: string;
    aqi: string;
    aqi_remark: string;
    aqi_description: string;
    last_update: string;
    bg_image: string;
  };
}

/**
 * Service responsible for fetching and caching weather data
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly _apiurl = 'https://the-weather-api.p.rapidapi.com/api/weather';
  private readonly _cacheExpirationMinutes = 30; // Cache expires in 30 minutes

  constructor(
    private readonly _http: HttpClient,
    private readonly _cacheService: CacheService
  ) {}

  /**
   * Fetches weather data for a specific city, using cache if available
   * @param city - The name of the city to fetch weather data for
   * @returns Observable of WeatherResponse or error object
   */
  searchWeatherByCity(city: string): Observable<WeatherResponse> {
    // Check cache first
    const cachedData = this._cacheService.get<WeatherResponse>(city);
    if (cachedData) {
      console.log('Returning cached weather data for:', city);
      return of(cachedData);
    }

    const headers = new HttpHeaders()
      .set('X-RapidAPI-Key', environment.rapidApiKey ?? '')
      .set('X-RapidAPI-Host', 'the-weather-api.p.rapidapi.com');

    const options = { headers };
    
    console.log(`Fetching fresh weather data for city: ${city}`);

    return this._http.get<WeatherResponse>(`${this._apiurl}/${encodeURIComponent(city)}`, options)
      .pipe(
        tap(response => {
          // Cache the response
          this._cacheService.set(city, response, this._cacheExpirationMinutes);
        }),
        catchError(this._handleError)
      );
  }

  /**
   * Clears the weather cache
   */
  clearCache(): void {
    this._cacheService.clear();
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
