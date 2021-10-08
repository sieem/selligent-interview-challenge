import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck, shareReplay } from 'rxjs/operators';

export type Filters = Record<string, string | string[] | null>;

export abstract class AbstractFilterService {
  protected filters$!: Observable<Filters>;

  filterByKey$ = <T extends string | string[] | null>(key: string): Observable<T | null> =>
    this.filters$.pipe(
      pluck<Filters, T>(key),
      map((filter) => filter ?? null),
      distinctUntilChanged(),
      shareReplay({ refCount: false, bufferSize: 1 })
    );

  abstract updateFilters(filters: Filters): Promise<boolean>;
}
