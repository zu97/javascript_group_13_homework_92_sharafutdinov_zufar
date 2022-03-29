import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-centered-card',
  templateUrl: './centered-card.component.html',
  styleUrls: ['./centered-card.component.css']
})
export class CenteredCardComponent {
  @Input() title = '';
}
