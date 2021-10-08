import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { PhotosApiService, PhotosResponseDto } from '../services/photosApi.service';
import { mapDtoToPhotos, mapPhotosToDto, Photos, PhotosResponse } from './photos.facade.util';

@Injectable({
  providedIn: 'root'
})
export class PhotosFacade {

  photosSubject$ = new BehaviorSubject<Photos>({
    search: '',
    id: 0,
  });

  photosList$: Observable<{
    data: PhotosResponse[];
  }> = this.photosSubject$.pipe(
    map((photos) => mapPhotosToDto(photos)),
    switchMap((photos) => this.photosApiService.retrievePhotos(photos)),
    map((photos: PhotosResponseDto[]) => ({
      data: photos.map(mapDtoToPhotos),
    })),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  constructor(private photosApiService: PhotosApiService) { }

  setPhotos(requestBody: Partial<Photos>): void {
    this.photosSubject$.next({ ...this.photosSubject$.getValue(), ...requestBody });
  }
}
