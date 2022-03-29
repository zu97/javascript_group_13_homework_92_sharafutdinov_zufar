import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent {
  @Input() ws!: WebSocket;
  @ViewChild('f') form!: NgForm;

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const message = this.form.form.get('message')?.value;
    this.ws.send(JSON.stringify({
      type: 'MESSAGE',
      message,
    }));
  }
}
