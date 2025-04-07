import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeatherService, WeatherResponse } from './service/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchForm!: FormGroup;
  weather?: WeatherResponse['data'];
  readonly imagePath: string = '/assets/1.jpg'; // Use absolute path for assets

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _weatherService: WeatherService,
    private readonly _snackBar: MatSnackBar
  ) {
    this._initForm();
  }

  ngOnInit(): void {
    // Initialize component
  }

  /**
   * Initializes the search form with validators
   */
  private _initForm(): void {
    this.searchForm = this._fb.group({
      city: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z\\s-]+$') // Only allow letters, spaces, and hyphens
      ]]
    });
  }

  /**
   * Handles the weather search when form is submitted
   */
  searchWeather(): void {
    if (this.searchForm.valid) {
      const city = this.searchForm.get('city')?.value;
      
      this._weatherService.searchWeatherByCity(city).subscribe({
        next: (response: WeatherResponse) => {
          this.weather = response.data;
          this._snackBar.open('Weather data fetched successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Failed to fetch weather:', error);
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
