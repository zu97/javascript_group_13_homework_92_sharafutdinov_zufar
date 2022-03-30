import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatUser } from '../../../models/chat.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/types';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent {
  @Input() ws!: WebSocket;
  @ViewChild('f') form!: NgForm;

  users: Observable<ChatUser[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.users = store.select((state) => state.chat.users);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const recipient = this.form.form.get('recipient')?.value;
    const message = this.form.form.get('message')?.value;

    this.ws.send(JSON.stringify({
      type: 'MESSAGE',
      recipient,
      message,
    }));
  }
}
