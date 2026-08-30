import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appLoading]',
})
export class LoadingDirective {
  el = inject(ElementRef<HTMLButtonElement>);

  appLoading = input(false);

  constructor() {
    effect(() => {
      const isLoading = this.appLoading();
      const button = this.el.nativeElement;

      button.disabled = isLoading;

      if (isLoading) {
        button.classList.add('btn-loading');
      } else {
        button.classList.remove('btn-loading');
      }
    });
  }
}
