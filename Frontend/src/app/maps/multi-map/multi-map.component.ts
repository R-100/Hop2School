import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import { Adress, Ride } from '../../types';
import { config, Map, MapStyle, Marker } from '@maptiler/sdk';
import { GeocodingService } from '../../service/frontend/geocoding.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-multi-map',
  standalone: true,
  imports: [MatTooltipModule, CommonModule],
  templateUrl: './multi-map.component.html',
  styleUrl: './multi-map.component.scss'
})
export class MultiMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  map: Map | undefined;
  private schoolCoords = { lng: 12.403097000000002, lat: 50.527809 };
  private markerSchool!: Marker;
  private markers: Marker[] = [];

  @Input() markerButton: boolean = false;
  @Input() findAdress!: Adress;
  @Input() rides: Ride[] = [];
  @Input() radius: number = 0; // in km
  @Input() isRadiusSearchActive = false;
  @Input() doubleAdressFunction: boolean = false;

  @Output() openRideSaleEvent = new EventEmitter<Ride>();
  @Output() openRidesCardEvent = new EventEmitter<Ride[]>();

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(private geocodingService: GeocodingService) {
    config.apiKey = '';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.mapContainer) {
        return;
      }
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: MapStyle.STREETS,
        center: [this.schoolCoords.lng, this.schoolCoords.lat],
        zoom: 10
      });
      this.markerSchool = new Marker({ color: '#FF0000' })
        .setLngLat([this.schoolCoords.lng, this.schoolCoords.lat])
        .addTo(this.map);
      this.setAllMarker();
      if (this.isRadiusSearchActive && this.radius > 0) {
        this.setRaduisBorder();
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['findAdress'] || changes['rides']) && this.map) {
      this.setAllMarker();
    }
    if (this.isRadiusSearchActive && changes['radius'] && this.map) {
      this.setRaduisBorder();
      this.setAllMarker();
    }
  }

  private async setAllMarker() {
    if (!this.map) return;
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  
    for (const ride of this.rides) {
      const address = `${ride.street} ${ride.houseNumber}, ${ride.postalCode} ${ride.city}`;
  
      try {
        const cordis = await this.geocodingService.getCoordinates(address);
        const distanceInKm = this.getDistanceInKm(this.schoolCoords.lat, this.schoolCoords.lng, cordis.lat, cordis.lng);
  
        if (this.isRadiusSearchActive && this.radius > 0 && distanceInKm > this.radius) {
          continue;
        }
  
        const isFindAddress = this.findAdress &&
          ride.street === this.findAdress.street &&
          ride.houseNumber === this.findAdress.houseNumber &&
          ride.postalCode === this.findAdress.postalCode &&
          ride.city === this.findAdress.city;
  
        let color = '#00FF00';
        if (!this.markerButton) {
          color = isFindAddress ? '#0000FF' : '#00FF00';
        }
  
        const marker = new Marker({ color })
          .setLngLat([cordis.lng, cordis.lat])
          .addTo(this.map!);
  
        if (this.markerButton) {
          marker.getElement().addEventListener('click', () => {
            const matchingRides = this.rides.filter(r =>
              r.street === ride.street &&
              r.houseNumber === ride.houseNumber &&
              r.postalCode === ride.postalCode &&
              r.city === ride.city
            );
            if (matchingRides.length > 1 && this.doubleAdressFunction) {
              this.openRidesCardEvent.emit(matchingRides);
            } else {
              this.openRideSaleEvent.emit(ride);
            }
          });
        }
  
        this.markers.push(marker);
      } catch (error) {
        console.log(`Adresse nicht gefunden: ${address}`);
      }
    }
  }  


  private setRaduisBorder() {
    if (!this.map) return;
    const run = () => {
      const center = [this.schoolCoords.lng, this.schoolCoords.lat];
      const radiusInMeters = this.radius * 1000;
      const points = 64;
      const coords: number[][] = [];

      for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points;
        const offsetX = radiusInMeters * Math.cos((angle * Math.PI) / 180);
        const offsetY = radiusInMeters * Math.sin((angle * Math.PI) / 180);
        const dx = offsetX / (111320 * Math.cos((center[1] * Math.PI) / 180));
        const dy = offsetY / 110540;
        coords.push([center[0] + dx, center[1] + dy]);
      }
      coords.push(coords[0]);
      const circleGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coords]
        },
        properties: {}
      };
      if (this.map!.getLayer('radius-circle')) {
        this.map!.removeLayer('radius-circle');
      }
      if (this.map!.getLayer('radius-circle-outline')) {
        this.map!.removeLayer('radius-circle-outline');
      }
      if (this.map!.getSource('radius-source')) {
        this.map!.removeSource('radius-source');
      }
      this.map!.addSource('radius-source', {
        type: 'geojson',
        data: circleGeoJSON
      });
      this.map!.addLayer({
        id: 'radius-circle',
        type: 'fill',
        source: 'radius-source',
        paint: {
          'fill-color': '#40E0D0',
          'fill-opacity': 0.2
        }
      });
      this.map!.addLayer({
        id: 'radius-circle-outline',
        type: 'line',
        source: 'radius-source',
        paint: {
          'line-color': '#40E0D0',
          'line-width': 2
        }
      });
    };
    if (this.map.isStyleLoaded()) {
      run();
    } else {
      this.map.once('load', run);
    }
  }

  private getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
