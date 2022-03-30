import { Component, Input } from '@angular/core';
import { AppState } from '../../../store/types';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../../models/chat.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent {
  @Input() ws!: WebSocket;

  user: Observable<null | User>;
  messages: Observable<ChatMessage[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.user = store.select((state) => state.users.user);
    this.messages = store.select((state) => state.chat.messages);
  }

  onRemove(messageId: string) {
    this.ws.send(JSON.stringify({
      type: 'REMOVE_MESSAGE',
      id: messageId,
    }));
  }

}
