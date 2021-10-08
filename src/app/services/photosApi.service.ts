/**
 * Generated by orval v6.1.1 🍺
 * Do not edit manually.
 * Content API
 * Content APIs
 * OpenAPI spec version: 1.0.0
 */
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpContext
} from '@angular/common/http'
import {
  Injectable
} from '@angular/core'
import {
  Observable
} from 'rxjs'
import { map} from 'rxjs/operators';

export interface PhotosRequestDto {
  search: string;
  id: number;
}

export interface PhotosResponseDto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}


type HttpClientOptions = {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: any;
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: any;
  withCredentials?: boolean;
};



@Injectable({ providedIn: 'root' })
export class PhotosApiService {
  constructor(
    private http: HttpClient,
  ) { } retrievePhotos<T = PhotosResponseDto>({ id, search }: PhotosRequestDto, options?: HttpClientOptions): Observable<T[]> {
    return this.http.get<T[]>(
      `https://jsonplaceholder.typicode.com/photos/${id !== 0 ? id : ''}`,
      options
    ).pipe(
      // @ts-ignore
      map((response) => response.filter((item) => search ? item.title.includes(search) : true))
    );
  }
};
