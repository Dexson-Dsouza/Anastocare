import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})
export class PatientHomeComponent implements OnInit {
  params = {
    cookie: "",
    email: ""
  };
  loggedInUser;
  quesion_image = 'assets/quesion_image.png'
  graph_image = 'assets/graph2.png'
  lastTime;
  constructor(
    public commonService: CommonService,
    private localStorage: LocalStorageService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.params.cookie = this.localStorage.get("cookie");
    this.params.email = this.localStorage.get("email");

    if (this.params.cookie == null) {
      this.router.navigateByUrl("signin");
      return;
    }
    this.getUserDetails();
    this.getLastestQuestionaire();
  }

  today = 0;
  getLastestQuestionaire() {
    this.authService.getlatestQuestionaire(this.params.email).subscribe(data => {
      console.log(data);

      let cur = new Date();
      const mySet1 = new Set();
      if (Array.isArray(data) && data.length > 0) {

        for (let x of data) {
          let date = new Date(x.timestamp);
          if (date.toLocaleDateString() == cur.toLocaleDateString()) {
            mySet1.add(x.timestamp);
          }
        }
      }
      // mySet1.forEach(x => {
      //   let date = new Date(x);
      //   console.log(date.toLocaleDateString());
      // });
      if (mySet1.size > 0) {
        this.lastTime = Math.max.apply(this, [...mySet1]);
      }
      console.log(this.lastTime, " time")
      this.today = mySet1.size;
    });
  }

  formatAMPM(time) {
    let date = new Date(time);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  getUserDetails() {
    this.authService.getDetails(this.params.email).subscribe(data => {
      console.log("resp ", data);
      if (Array.isArray(data)) {
        for (let x of data) {
          if (x.email == this.params.email) {
            this.loggedInUser = x;
          }
        }
      }
      console.log("user ", this.loggedInUser);
    }, err => {
      console.log(err);
    })
  }

  logout() {
    this.router.navigateByUrl("signin");
  }
  gotoProfile() {
    this.router.navigateByUrl("view-profile");
  }

  gotoHome() {
    this.router.navigateByUrl("patient-home");
  }

  gotoQuestionaire() {
    this.router.navigateByUrl("questionnaire");
  }

  gotoReports() {
    this.router.navigateByUrl("reports");
  }
}
