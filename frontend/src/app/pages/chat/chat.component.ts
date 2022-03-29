import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { messagesIncome, userDisconnected, usersConnected } from '../../store/chat.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private user: Observable<null | User>;
  private userData: null | User = null;

  ws!: WebSocket;
  private isWsClosed = false;

  private userSubscription!: Subscription;

  constructor(private store: Store<AppState>) {
    this.user = store.select((state) => state.users.user);
  }

  ngOnInit(): void {
    this.userSubscription = this.user.subscribe((user) => {
       this.userData = user;
    });

    this.ws = new WebSocket(env.wsUrl + '/chat');
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'CONNECTED_USERS':
          this.store.dispatch(usersConnected({ users: message.users }));
          break;
        case 'USER_DISCONNECTED':
          this.store.dispatch(userDisconnected({ userId: message.id }));
          break;
        case 'MESSAGES':
          this.store.dispatch(messagesIncome({ messages: message.messages }));
          break;
        default:
          return;
      }
    };

    this.ws.onclose = () => {
      if (this.isWsClosed) {
        return;
      }

      setTimeout(() => {
        this.ws = new WebSocket(env.wsUrl + '/chat');
      }, 1000);
    };

    this.ws.onopen = () => {
      if (this.userData) {
        this.ws.send(JSON.stringify({
          type: 'AUTH',
          token: this.userData.token
        }));
      }
    };
  }

  ngOnDestroy(): void {
    this.isWsClosed = true;

    this.ws.close();
    this.userSubscription.unsubscribe();
  }

}
