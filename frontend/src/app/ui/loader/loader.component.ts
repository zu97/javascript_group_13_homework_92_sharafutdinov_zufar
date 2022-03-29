import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  spinnerIsLoading = false;
  spinnerSize = 25;

  @Input() set isLoading(isLoading: null | boolean) {
    this.spinnerIsLoading = Boolean(isLoading);
  }
  @Input() set size(size: string) {
    this.spinnerSize = size === 'sm' ? 25 : 50;
  }
}
