import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Map, MapStyle, Marker, config } from '@maptiler/sdk';
import { GeocodingService } from '../../service/frontend/geocoding.service';
import { Adress, Cordinates } from '../../types';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../service/backend/user.service';

@Component({
  selector: 'app-solo-map',
  standalone: true,
  imports: [MatTooltipModule, CommonModule],
  templateUrl: './solo-map.component.html',
  styleUrls: ['./solo-map.component.scss']
})
export class SoloMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  map: Map | undefined;
  private schoolCoords = { lng: 13.387466, lat: 52.518081 };
  private markerSchool!: Marker;
  private markerAdress!: Marker | null;

  @Input() findAdress!: Adress | null;
  @ViewChild('mapContainer', { static: false }) private mapContainer!: ElementRef<HTMLElement>;


  constructor(private geocodingService: GeocodingService, private userService: UserService) { }

  private async initConfig() {
    const key = await this.userService.getGeoCodingApiKey();
    if (!key) {
      console.error("API Key null!");
      return;
    }
    config.apiKey = key;
    requestAnimationFrame(() => this.initMap());
  }

  ngAfterViewInit() {
    this.initConfig();
  }

  private initMap() {
    if (!this.mapContainer) {
      console.error("Map-Container nicht gefunden!");
      return;
    }
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [this.schoolCoords.lng, this.schoolCoords.lat],
      zoom: 10
    });
    this.markerSchool = new Marker({ color: "#FF0000" })
      .setLngLat([this.schoolCoords.lng, this.schoolCoords.lat])
      .addTo(this.map);
    this.markerAdress = null;
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['findAdress']?.currentValue) {
      const current = changes['findAdress'].currentValue;
      const previous = changes['findAdress'].previousValue;

      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        this.updateMarker();
      }
    }
  }

  private updateMarker() {
    if (!this.map) {
      return;
    }
    if (this.findAdress) {
      this.geocodingService.getCoordinates(
        `${this.findAdress.street} ${this.findAdress.houseNumber}, ${this.findAdress.postalCode} ${this.findAdress.city}`
      ).then(data => {
        if (data.lng !== null && data.lat !== null) {
          if (this.markerAdress) {
            this.markerAdress.setLngLat([data.lng, data.lat]);
          } else {
            this.markerAdress = new Marker({ color: "#008000" })
              .setLngLat([data.lng, data.lat])
              .addTo(this.map!);
          }
          this.map!.setCenter([data.lng, data.lat]);
        }
      });
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
