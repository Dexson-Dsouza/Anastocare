import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

   public loginAdminFromPortal(user: User): Observable<any>{
     return this.http.post("http://localhost:8080/api/v1/",user)
   }



}
