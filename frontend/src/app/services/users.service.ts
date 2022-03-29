import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { LoginUserData, RegisterUserData, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) {}

  registerUser(userData: RegisterUserData) {
    return this.http.post<User>(env.apiUrl + '/users', userData);
  }

  loginUser(userData: LoginUserData) {
    return this.http.post<User>(env.apiUrl + '/users/sessions', userData);
  }

  logoutUser(token: string) {
    return this.http.delete(env.apiUrl + '/users/sessions', {
      headers: new HttpHeaders({
        'Authorization': token,
      }),
    });
  }

}
