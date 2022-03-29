import { createAction, props } from '@ngrx/store';
import { ChatMessage, ChatUser } from '../models/chat.model';

export const usersConnected = createAction('[Chat] Users Connected', props<{ users: ChatUser[] }>());
export const userDisconnected = createAction('[Chat] User Disconnected', props<{ userId: string }>());
export const messagesIncome = createAction('[Chat] Messages Income', props<{ messages: ChatMessage[] }>());
