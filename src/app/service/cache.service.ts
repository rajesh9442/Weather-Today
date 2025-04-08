import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

/**
 * Service responsible for managing browser-based caching of API responses
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly _prefix = 'weather_cache_';
  private readonly _lastSearchedKey = 'last_searched_city';
  
  /**
   * Stores data in localStorage with expiration
   * @param key - Cache key
   * @param data - Data to cache
   * @param expiresInMinutes - Cache expiration time in minutes
   */
  set<T>(key: string, data: T, expiresInMinutes: number = 30): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMinutes * 60 * 1000 // Convert to milliseconds
    };
    
    localStorage.setItem(this._prefix + key, JSON.stringify(entry));
    // Store the last searched city
    this.setLastSearchedCity(key);
  }

  /**
   * Retrieves data from cache if it exists and hasn't expired
   * @param key - Cache key
   * @returns The cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    const item = localStorage.getItem(this._prefix + key);
    
    if (!item) return null;

    const entry: CacheEntry<T> = JSON.parse(item);
    const now = Date.now();
    
    // Check if cache has expired
    if (now - entry.timestamp > entry.expiresIn) {
      this.remove(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Removes an item from cache
   * @param key - Cache key to remove
   */
  remove(key: string): void {
    localStorage.removeItem(this._prefix + key);
  }

  /**
   * Clears all cached weather data
   */
  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this._prefix))
      .forEach(key => localStorage.removeItem(key));
    localStorage.removeItem(this._lastSearchedKey);
  }

  /**
   * Stores the last searched city
   * @param city - City name
   */
  private setLastSearchedCity(city: string): void {
    localStorage.setItem(this._lastSearchedKey, city);
  }

  /**
   * Gets the last searched city
   * @returns The last searched city or null if none exists
   */
  getLastSearchedCity(): string | null {
    return localStorage.getItem(this._lastSearchedKey);
  }
}
