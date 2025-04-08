import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeatherService, WeatherResponse } from './service/weather.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CacheService } from './service/cache.service';
import { 
  faSearch, 
  faThermometerHalf, 
  faWind, 
  faDroplet, 
  faEye, 
  faSun, 
  faLeaf
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'weatherApp';
  searchForm!: FormGroup;
  weather?: WeatherResponse['data'];
  loading = false;
  backgroundStyle: { [key: string]: string } = {};

  // Icons
  faSearch = faSearch;
  faThermometer = faThermometerHalf;
  faWind = faWind;
  faDroplet = faDroplet;
  faEye = faEye;
  faSun = faSun;
  faLeaf = faLeaf;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _weatherService: WeatherService,
    private readonly _snackBar: MatSnackBar,
    private readonly _renderer: Renderer2,
    private readonly _cacheService: CacheService
  ) {
    this._initForm();
  }

  ngOnInit(): void {
    this._loadLastSearchedWeather();
  }

  /**
   * Loads the last searched weather data from cache if available
   */
  private _loadLastSearchedWeather(): void {
    const lastSearchedCity = this._cacheService.getLastSearchedCity();
    if (lastSearchedCity) {
      const cachedWeather = this._cacheService.get<WeatherResponse>(lastSearchedCity);
      if (cachedWeather) {
        this.weather = cachedWeather.data;
        this._updateBackgroundImage(cachedWeather.data.bg_image);
        this.searchForm.patchValue({ city: lastSearchedCity });
      }
    }
  }

  /**
   * Updates the page background with the weather image
   * @param imageUrl - URL of the weather background image
   */
  private _updateBackgroundImage(imageUrl: string): void {
    // Create a color scheme based on the time of day (you can enhance this logic)
    const isDaytime = new Date().getHours() > 6 && new Date().getHours() < 18;
    const gradientOverlay = isDaytime
      ? 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(0,0,0,0.5))'
      : 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(30,60,114,0.8))';

    this.backgroundStyle = {
      'background-image': `${gradientOverlay}, url(${imageUrl})`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-attachment': 'fixed',
      'backdrop-filter': 'blur(10px)'
    };
  }

  private _initForm(): void {
    this.searchForm = this._fb.group({
      city: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z\\s-]+$')
      ]]
    });
  }

  searchWeather(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      const city = this.searchForm.get('city')?.value;
      
      this._weatherService.searchWeatherByCity(city).subscribe({
        next: (response: WeatherResponse) => {
          this.weather = response.data;
          this._updateBackgroundImage(response.data.bg_image);
          this.loading = false;
          this._snackBar.open('Weather data fetched successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Failed to fetch weather:', error);
          this.loading = false;
          this._snackBar.open(
            'Failed to fetch weather data. Please try again.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}
