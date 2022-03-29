import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../services/users.service';
import {
  loginUserFailure,
  loginUserRequest,
  loginUserSuccess,
  logoutUser,
  logoutUserRequest,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess
} from './users.actions';
import { map, mergeMap, NEVER, tap, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from './types';
import { HelpersServices } from '../services/helpers.services';

@Injectable()
export class UsersEffects {

  constructor(
    private actions: Actions,
    private router: Router,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private helpersService: HelpersServices,
    private store: Store<AppState>,
  ) {}

  registerUser = createEffect(() => this.actions.pipe(
    ofType(registerUserRequest),
    mergeMap(({userData}) => this.usersService.registerUser(userData).pipe(
      map((user) => registerUserSuccess({user})),
      tap(() => {
        this.snackBar.open('User is registered');
        void this.router.navigate(['/']);
      }),
      this.helpersService.catchServerError(registerUserFailure)
    )),
  ));

  loginUser = createEffect(() => this.actions.pipe(
    ofType(loginUserRequest),
    mergeMap(({userData}) => this.usersService.loginUser(userData).pipe(
      map((user) => loginUserSuccess({user})),
      tap(() => {
        this.helpersService.openSnackBar('Login successful');
        void this.router.navigate(['/']);
      }),
      this.helpersService.catchServerError(loginUserFailure),
    )),
  ));

  logoutUser = createEffect(() => this.actions.pipe(
    ofType(logoutUserRequest),
    withLatestFrom(this.store.select(state => state.users.user)),
    mergeMap(([_, user]) => {
      if (user) {
        return this.usersService.logoutUser(user.token).pipe(
          map(() => logoutUser()),
          tap(() => {
            void this.router.navigate(['/login']);
            this.helpersService.openSnackBar('Logout successful');
          }),
        );
      }

      return NEVER;
    })
  ))

}
