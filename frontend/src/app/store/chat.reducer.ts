import { ChatState } from './types';
import { createReducer, on } from '@ngrx/store';
import { closeConnection, messagesIncome, removeMessage, userDisconnected, usersConnected } from './chat.actions';

const initialState: ChatState = {
  users: [],
  messages: [],
}

export const chatReducer = createReducer(
  initialState,
  on(usersConnected, (state, {users}) => {
    let newState = {...state};

    users.forEach((user) => {
      const check = newState.users.find((u) => u._id === user._id);
      if (!check) {
        newState.users = [ ...newState.users, user ];
      }
    });

    return newState;
  }),
  on(userDisconnected, (state, {userId}) => {
    let newState = {...state};

    const index = newState.users.findIndex((user) => user._id === userId);
    if (index !== -1) {
      const newUsers = [...newState.users];
      newUsers.splice(index, 1);
      newState.users = newUsers;
    }

    return newState;
  }),
  on(messagesIncome, (state, {messages}) => {
    let newState = {...state};

    messages.forEach((message) => {
      const check = newState.messages.find((m) => m._id === message._id);
      if (!check) {
        newState.messages = [ ...newState.messages, message ];
      }
    });

    return newState;
  }),
  on(removeMessage, (state, {messageId}) => {
    let newState = {...state};

    const index = newState.messages.findIndex((message) => message._id === messageId);
    if (index !== -1) {
      const newMessages = [...newState.messages];
      newMessages.splice(index, 1);
      newState.messages = newMessages;
    }

    return newState;
  }),
  on(closeConnection, state => ({...state, users: [], messages: []})),
);
