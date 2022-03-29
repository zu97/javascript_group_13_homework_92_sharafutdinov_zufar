import { LoginError, RegisterError, User } from '../models/user.model';
import { ChatMessage, ChatUser } from '../models/chat.model';

export type UsersState = {
  user: null | User,
  registerLoading: boolean,
  registerError: null | RegisterError,
  loginLoading: boolean,
  loginError: null | LoginError,
};

export type ChatState = {
  users: ChatUser[],
  messages: ChatMessage[],
};

export type AppState = {
  users: UsersState,
  chat: ChatState,
};
