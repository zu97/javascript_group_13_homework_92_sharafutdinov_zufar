import { Component } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../../models/chat.model';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent {
  messages: Observable<ChatMessage[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.messages = store.select((state) => state.chat.messages);
  }

}
