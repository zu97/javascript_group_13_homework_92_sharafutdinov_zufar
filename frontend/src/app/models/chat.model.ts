export interface ChatUser {
  _id: string;
  displayName: string;
}

export interface ChatMessage {
  _id: string;
  user: {
    _id: string;
    displayName: string;
  };
  message: string;
}
