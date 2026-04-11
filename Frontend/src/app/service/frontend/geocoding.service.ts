import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Cordinates } from '../../types';
import { Coordinates } from '@maptiler/sdk';
import { UserService } from '../backend/user.service';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiKey!: string;
  private baseUrl = 'https://api.maptiler.com/geocoding/';

  constructor(private http: HttpClient, private userService: UserService) { }

  async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    this.apiKey = await this.userService.getGeoCodingApiKey();
    return this.apiKey;
  }

  async getCoordinates(address: string): Promise<Cordinates> {
    const apiKey = await this.getApiKey();
    const url = `${this.baseUrl}${encodeURIComponent(address + ", Germany")}.json?key=${apiKey}`;
    const data = await lastValueFrom(
      this.http.get<{ features: { geometry?: { coordinates: [number, number] } }[] }>(url)
    );
    const feature = data.features?.[0];
    if (feature?.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates;
      return { lat, lng };
    }
    throw new Error('Address not found');
  }


  async getAddress(lng: number, lat: number): Promise<string> {
    const apiKey = await this.getApiKey();
    const url = `${this.baseUrl}${lng},${lat}.json?key=${apiKey}`;
    const data = await lastValueFrom(
      this.http.get<{ features: { place_name: string }[] }>(url)
    );
    if (data.features.length > 0) {
      return data.features[0].place_name;
    }
    throw new Error('Address not found');
  }
}
