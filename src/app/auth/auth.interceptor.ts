import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Auth, authState} from '@angular/fire/auth';
import {from, switchMap, take} from 'rxjs';
import {environment} from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Nur API Calls absichern
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const auth = inject(Auth);

  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      if (!user) return next(req);
      return from(user.getIdToken()).pipe(
        switchMap(token => next(req.clone({
          setHeaders: {Authorization: `Bearer ${token}`}
        })))
      );
    })
  );
};
