import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { AbstractFilterService, Filters } from './abstract-filter.service';

@Injectable({ providedIn: 'root' })
export class FilterService extends AbstractFilterService {
  protected filters$: Observable<Filters> = this.activatedRoute.queryParams.pipe(
    distinctUntilChanged(),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  private notNavigating$ = new BehaviorSubject<boolean>(true);

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    super();
    this.router.events
      .pipe(
        filter((event) => !(event instanceof RouteConfigLoadStart || event instanceof RouteConfigLoadEnd)),
        map((event) => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(this.notNavigating$);
  }

  updateFilters(filters: Filters): Promise<boolean> {
    // eslint-disable-next-line rxjs/no-subject-value
    if (this.notNavigating$.getValue()) {
      return this.router.navigate([], { queryParams: filters, queryParamsHandling: 'merge' });
    }
    return Promise.resolve(false);
  }
}
