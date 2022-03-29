import { ChatState } from './types';
import { createReducer, on } from '@ngrx/store';
import { messagesIncome, userDisconnected, usersConnected } from './chat.actions';

const initialState: ChatState = {
  users: [],
  messages: [],
}

export const chatReducer = createReducer(
  initialState,
  on(usersConnected, (state, {users}) => ({...state, users: [ ...state.users, ...users ]})),
  on(userDisconnected, (state, {userId}) => {
    let newState = {...state};

    const index = newState.users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      const newUsers = [...newState.users];
      newUsers.splice(index, 1);
      newState.users = newUsers;
    }

    return newState;
  }),
  on(messagesIncome, (state, {messages}) => ({...state, messages: [...state.messages, ...messages]})),
);
