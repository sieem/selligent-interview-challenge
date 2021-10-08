import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, shareReplay } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { FilterService } from 'src/app/services/filter.service';

export type ToggleButtonItem = string | Record<string, unknown>;

export interface FormFilters {
  search: string | null;
  toggles: ToggleButtonItem[];
}

export interface FilterbarSearchFieldOptions {
  label: string;
  prefix: string;
}

const defaultFilterbarSearchFieldOptions: FilterbarSearchFieldOptions = {
  label: 'search',
  prefix: '',
};

export interface FilterbarTogglesFieldOptions {
  allItems: ToggleButtonItem[];
  prefix: string;
  trackBy: (toggleButton: ToggleButtonItem) => string;
}

const defaultFilterbarTogglesFieldOptions: FilterbarTogglesFieldOptions = {
  allItems: [],
  prefix: '',
  trackBy: (value: ToggleButtonItem): string => value as string,
};

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-filterbar',
  template: `
    <form [formGroup]="$any(formFilters)">
        <app-search *ngIf="searchControl" [label]="searchOptions.label" formControlName="search"></app-search>
    </form>
    <ng-template #defaultTemplate let-label> {{ label }} </ng-template>
  `,
})
export class FilterbarComponent implements AfterViewInit {
  /** Use search*/
  @Input()
  set withSearch(searchOptionsOrBoolean: Partial<FilterbarSearchFieldOptions> | boolean) {
    if (!this.searchControl) {
      this.searchOptions =
        typeof searchOptionsOrBoolean === 'boolean'
          ? defaultFilterbarSearchFieldOptions
          : {
            ...defaultFilterbarSearchFieldOptions,
            ...(searchOptionsOrBoolean ?? {}),
          };

      this.formFilters.addControl('search', new FormControl<FormFilters['search']>());

      this.initSearchFilterObservable();
      this.updateFiltersOnSearchChange();
      this.updateSearchControlOnFilterChange();
    }
  }
  searchOptions!: FilterbarSearchFieldOptions;

  search$: Observable<FormFilters['search']> = of(null);

  get searchControl(): FormControl<FormFilters['search']> | undefined {
    return this.formFilters?.getControl<'search'>('search') as FormControl;
  }

  private initSearchFilterObservable(): void {
    this.search$ = this.filterService
      .filterByKey$<string>(`${this.searchOptions.prefix}search`)
      .pipe(shareReplay({ refCount: false, bufferSize: 1 }));
  }

  private updateSearchControlOnFilterChange(): void {
    this.searchControl?.setValue(this.search$.pipe(untilDestroyed(this)), { emitEvent: false });
  }

  private updateFiltersOnSearchChange(): void {
    this.searchControl?.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: (value) => {
        this.filterService.updateFilters({ [`${this.searchOptions.prefix}search`]: value && value !== '' ? value : null });
      },
    });
  }

  /** Use toggles*/
  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;
  @Input()
  set withToggles(togglesOptions: Partial<FilterbarTogglesFieldOptions>) {
    if (!this.togglesControl && togglesOptions.allItems && togglesOptions.allItems.length > 0) {
      this.togglesOptions = {
        ...defaultFilterbarTogglesFieldOptions,
        ...togglesOptions,
      };

      this.formFilters.addControl('toggles', new FormControl<FormFilters['toggles']>([]));

      this.initTogglesFilterObservable();
      this.updateFiltersOnTogglesChange();
      this.updateTogglesControlOnFilterChange();
    }
  }
  togglesOptions!: FilterbarTogglesFieldOptions;

  toggles$: Observable<FormFilters['toggles']> = of([]);

  get togglesControl(): FormControl<FormFilters['toggles']> | undefined {
    return this.formFilters?.getControl<'toggles'>('toggles') as FormControl;
  }

  private mapValueToToggleButtonItem(toggleButtonKeys: string[]): ToggleButtonItem[] {
    return toggleButtonKeys.map(
      (toggleButtonKey) =>
        this.togglesOptions.allItems.find((toggleButtonItem) => this.togglesOptions.trackBy(toggleButtonItem) === toggleButtonKey) as ToggleButtonItem
    );
  }

  private initTogglesFilterObservable(): void {
    this.toggles$ = this.filterService.filterByKey$<string[]>(`${this.togglesOptions.prefix}toggles`).pipe(
      map((toggles) => {
        if (toggles === null) {
          return [];
        }
        return Array.isArray(toggles) ? toggles : [toggles];
      }),
      map((toggles) => this.mapValueToToggleButtonItem(toggles)),
      shareReplay({ refCount: false, bufferSize: 1 })
    );
  }

  private updateTogglesControlOnFilterChange(): void {
    this.togglesControl?.setValue(this.toggles$.pipe(untilDestroyed(this)), { emitEvent: false });
  }

  private updateFiltersOnTogglesChange(): void {
    this.togglesControl?.valueChanges
      .pipe(
        map((value) => value.map((toggle) => this.togglesOptions.trackBy(toggle))),
        untilDestroyed(this)
      )
      .subscribe({
        next: (value) => {
          this.filterService.updateFilters({ [`${this.togglesOptions.prefix}toggles`]: value.length === 0 ? null : value });
        },
      });
  }

  /** Filter output*/
  @Output()
  filterChanged = new EventEmitter<FormFilters>();

  formFilters: FormGroup<Partial<FormFilters>> = new FormGroup<Partial<FormFilters>>({});

  constructor(public filterService: FilterService) { }

  ngAfterViewInit(): void {
    combineLatest([this.search$, this.toggles$])
      .pipe(
        map(([search, toggles]) => ({ search, toggles })),
        untilDestroyed(this),
      )
      .subscribe({
        next: (filters) => {
          this.filterChanged.emit(filters);
        },
      });
  }
}
