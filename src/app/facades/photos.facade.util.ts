import { PhotosRequestDto, PhotosResponseDto } from '../services/photosApi.service';

export interface Photos {
  search: string;
  id: number;
}

export interface PhotosResponse {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const mapPhotosToDto = (photosDto: Photos): PhotosRequestDto => ({
  search: photosDto.search,
  id: photosDto.id,
});

export const mapDtoToPhotos = (photos: PhotosResponseDto): PhotosResponse => ({
  albumId: photos.albumId,
  id: photos.id,
  title: photos.title,
  url: photos.url,
  thumbnailUrl: photos.thumbnailUrl,
});



