import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterServiceService } from '../services/toaster-service.service';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private localStorage: LocalStorageService,
        private toastService: ToasterServiceService,
        private router: Router,
    ) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log("Intercepted")
        // request = request.clone({
        //     withCredentials: true,
        // });
        var token: string = this.localStorage.get('cookie');
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', token) });
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                console.log(error);
                // data = {
                //     reason: error && error.error.reason ? error.error.reason : '',
                //     status: error.status
                // };
                if (error.status == 403) {
                    this.router.navigateByUrl("signin");
                    this.toastService.toast("Session Expired");
                }
                return throwError(error);
            }));
    }
}
