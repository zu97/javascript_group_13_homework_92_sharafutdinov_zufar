export interface ChatUser {
  id: string;
  displayName: string;
}

export interface ChatMessage {
  user: {
    _id: string;
    displayName: string;
  };
  message: string;
}
