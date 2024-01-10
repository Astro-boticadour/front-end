import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nosession',
  templateUrl: './nosession.component.html',
  styleUrl: './nosession.component.scss',
})
export class NosessionComponent {
  @Output() createSessionEvent = new EventEmitter<undefined>();

  createSession() {
    this.createSessionEvent.emit();
  }
}
