import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private loggedUser;
  logo = 'assets/logo.PNG'

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorage: LocalStorageService,
  ) { }

  setUser(user) {
    this.loggedUser = user;
  }

  getUser() {
    // let t = {
    //   assignedDoctors: ['57 : Stephen  Strange'],
    //   email: "peter@mail.com",
    //   empId: null,
    //   name: "Peter Parker",
    //   orgId: 16,
    //   organisationName: "Albany Medical Centre",
    //   password: null,
    //   patientCount: 0,
    //   phone: "5544775566",
    //   status: "Enabled",
    //   userId: 58,
    //   userRole: "USER",
    //   username: "peter@mail.com",
    // };
    // return t;

    return this.loggedUser;
  }

  logout() {
    this.router.navigateByUrl("signin");
  }

  getUserDetail() {
    return new Promise((resolve, rej) => {
      let email = this.localStorage.get("email");
      this.authService.getDetails(email).subscribe(data => {
        console.log("resp ", data);
        if (Array.isArray(data)) {
          for (let x of data) {
            if (x.email == email) {
              this.loggedUser = x;
            }
          }
        }
        resolve(this.loggedUser);
        // console.log("user ", this.loggedInUser);
      }, err => {
        rej(err);
        console.log(err);
      })
    })
  }
}
