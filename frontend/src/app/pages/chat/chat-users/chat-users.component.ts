import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/types';
import { Observable } from 'rxjs';
import { ChatUser } from '../../../models/chat.model';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.css']
})
export class ChatUsersComponent {
  users: Observable<ChatUser[]>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.users = store.select((state) => state.chat.users);
  }
}
