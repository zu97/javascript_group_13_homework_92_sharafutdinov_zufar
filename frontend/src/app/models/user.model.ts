export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
}

export interface RegisterUserData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface FieldError {
  message: string;
}

export interface RegisterError {
  errors: {
    email?: undefined | FieldError;
    password?: undefined | FieldError;
    displayName?: undefined | FieldError;
  }
}

export interface LoginError {
  error: string;
}
