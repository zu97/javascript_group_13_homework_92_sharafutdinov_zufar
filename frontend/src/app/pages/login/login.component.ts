import { Component, ViewChild } from '@angular/core';
import { AppState } from '../../store/types';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LoginError } from '../../models/user.model';
import { loginUserRequest } from '../../store/users.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('f') form!: NgForm;

  isLoading: Observable<boolean>;
  error: Observable<null | LoginError>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.isLoading = store.select(state => state.users.loginLoading);
    this.error = store.select(state => state.users.loginError);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(loginUserRequest({ userData: this.form.value }));
  }

}
