import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search',
  template: `
      <span class="ml-1">{{ label }}</span>
      <div class="flex">
        <input [formControl]="searchControl" matInput type="text" />
      </div>
  `,
  host: {
    class: 'app-search',
  },
  styles: [
    `
      :host {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-right: 25px;
          margin-top: 25px;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true,
    },
  ],
})
export class SearchComponent extends ControlValueAccessor<string> implements OnInit {
  searching$ = new BehaviorSubject<boolean>(false);

  /** Form control used for the search*/
  searchControl = new FormControl<string>('');
  private searchValue$ = this.searchControl.valueChanges.pipe(
    tap(() => {
      this.searching$.next(true);
    }),
    debounceTime(300),
    map((value) => value?.trim()),
    tap(() => this.searching$.next(false)),
    distinctUntilChanged()
  );

  @Input()
  get value(): string {
    return this.searchControl.value;
  }

  set value(newValue: string) {
    if (newValue !== this.value) {
      this.searchControl.setValue(newValue, { emitEvent: false });

      //for when value is reset externally
      if (!newValue) {
        this.searchControl.reset();
      }
    }
  }

  @Input()
  label: string | null = '';

  @Output() readonly valueChange = this.searchValue$;

  /** Function called when the form control value is changed*/
  writeValue(value: string): void {
    this.value = value;
  }

  /** Function called when the component is initialized*/
  ngOnInit(): void {
    this.searchValue$.pipe(untilDestroyed(this)).subscribe((value: string) => this.onChange?.(value));
  }
}
