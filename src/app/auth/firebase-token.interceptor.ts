import {inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class FirebaseTokenInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // nur API calls
    if (!req.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(req);
    }

    return from(this.auth.getIdToken()).pipe(
      switchMap(token => {
        if (!token) return next.handle(req);
        return next.handle(req.clone({
          setHeaders: {Authorization: `Bearer ${token}`}
        }));
      })
    );
  }
}
