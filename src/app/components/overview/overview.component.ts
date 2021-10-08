import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PhotosFacade } from 'src/app/facades/photos.facade';
import { PhotosResponse } from 'src/app/facades/photos.facade.util';

@UntilDestroy()
@Component({
  selector: 'app-overview',
  template: `
    <ng-container *transloco="let t">
      <app-filterbar
        [withSearch]="{ label: t('FILTERABLE_GRID_SEARCH') }"
        (filterChanged)="onValueChange($event)"
      >
      </app-filterbar>
    </ng-container>
    <table mat-table #table [dataSource]="dataSource" [trackBy]="trackPhotoItemById">

      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Id</th>
        <td mat-cell *matCellDef="let photoItem">{{ photoItem.id }}</td>
      </ng-container>

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>title</th>
        <td mat-cell *matCellDef="let photoItem">{{ photoItem.title }}</td>
      </ng-container>

      <ng-container matColumnDef="thumbnailUrl">
        <th mat-header-cell *matHeaderCellDef ></th>
        <td mat-cell *matCellDef="let photoItem" class="photo">
          <img [src]="photoItem.thumbnailUrl">
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="5">
          No data
        </td>
      </tr>
    </table>
    <mat-paginator #paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 20]" [showFirstLastButtons]="true">
    </mat-paginator>
  `,
  styles: [`
    table {
      width: 100%;
    }
    .photo {
      display:flex;
      justify-content:flex-end;
    }
  `]
})
export class OverviewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<PhotosResponse>();
  columns: string[] = ['id', 'title', 'thumbnailUrl'];
  pageIndex = 0;

  id$: Observable<number | null> = this.route.params.pipe(
    map(({ id }) => (id ? Number(id) : null))
  );

  constructor(
    private photosFacade: PhotosFacade,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.id$.pipe(untilDestroyed(this)).subscribe((id) => {
      this.photosFacade.setPhotos({
        id: Number(id ?? 0),
      });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.photosFacade.photosList$
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.dataSource.data = result.data;
      });
  }

  onValueChange(filters: any): void {
    this.photosFacade.setPhotos({
      search: filters.search?.toString() ?? '',
    });
  }

  trackPhotoItemById(index: number, photoItem: PhotosResponse): string | number {
    return photoItem.id;
  }

}
