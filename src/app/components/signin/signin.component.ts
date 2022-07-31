import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Validation from '../utils/validation';
import { AuthService } from '../../services/auth.service'
import { LocalStorageService } from 'angular-2-local-storage';
import { Toaster } from 'ngx-toast-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import { CommonService } from 'src/app/services/common.service'
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  logo = 'assets/logo.PNG'

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private toastr: Toaster,
    private modalService: NgbModal,
    private toastService: ToasterServiceService,
    private commonService: CommonService,
  ) { }
  form: FormGroup;
  reset: FormGroup;
  submitted = false;
  submitted2 = false;
  @ViewChild('viewList') viewListModal: TemplateRef<any>;
  ngOnInit(): void {
    this.localStorage.clearAll();
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40)
          ]
        ],
      }
    );

    this.reset = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required
          ],],
        //   password: [
        //     '',
        //     [
        //       Validators.required,
        //       Validators.minLength(5),
        //       Validators.maxLength(40)
        //     ]
        //   ],
        //   confirmPassword: [
        //     '',
        //     [
        //       Validators.required,

        //     ]
        //   ]
      },
      // {
      //   validators: [Validation.match('password', 'confirmPassword')]
      // }
    );

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSave() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let body = {
      "username": this.form.value.username,
      "password": this.form.value.password,
    }
    // let body = new FormData();
    // body.append('username', this.form.value.username);
    // body.append('password', this.form.value.password);
    this.authService.loginUser(body).subscribe((resp) => {
      // try {
      //   resp = JSON.parse(resp);
      // } catch (error) {
      //   this.toastr.open({
      //     text: "Invalid Credentials",
      //     type: "dark",
      //     duration: 4000,
      //     position: 'bottom-center'
      //   });
      //   return;
      // }

      console.log(resp);
      if (resp["Status"] && resp["Status"] == 5000) {
        this.localStorage.set("email", this.form.value.username);
        this.localStorage.set("cookie", resp["Authorization"]);

        let cookie = this.localStorage.get("cookie");
        let email = this.localStorage.get("email");
        this.authService.getDetails(email).subscribe(data => {
          let loggedInUser = {};
          if (Array.isArray(data)) {
            for (let x of data) {
              if (x.email == email) {
                loggedInUser = x;
              }
            }
          }
          console.log("login details ", loggedInUser);
          this.commonService.setUser(loggedInUser);
          this.localStorage.set("user", loggedInUser);
          this.toastr.open({
            text: "Login Successful!",
            type: "dark",
            duration: 3000,
            position: 'bottom-center'
          });
          if (loggedInUser["userRole"] == "USER") {
            this.router.navigateByUrl("patient-home");
          } 
          else if (loggedInUser["userRole"] == "DOCTOR") {
            this.router.navigateByUrl("doctor-home");
          }
          
          else {
            this.router.navigateByUrl("admin-home");
          }
        }, err => {
          console.log(err);
        })
        // this.router.navigateByUrl("admin-home");

      } else if (resp["Status"] && resp["Status"] == 5001) {
        this.expired = true;
        this.toastr.open({
          text: "Account is not activated. Please check your inbox!",
          type: "dark",
          duration: 4000,
          position: 'bottom-center'
        });
      } else {
        this.toastr.open({
          text: "Invalid Credentials",
          type: "dark",
          duration: 4000,
          position: 'bottom-center'
        });
      }
      // const httpOptions = {
      // headers: new HttpHeaders({ 'set-cookie': '' }),
      // withCredentials: true,
      // observe: 'response' as 'response'
      // };
      // this.authService.getUserList(httpOptions).subscribe((data) => {
      //   console.log(data);
      // }, err => {
      //   console.log(err);
      // })
    }, err => {
      console.log('response headers', err);

      this.toastr.open({
        text: "Invalid Credentials",
        type: "dark",
        duration: 4000,
        position: 'bottom-center'
      });
      // if (err.error && err.error.text && err.error.text.length < 50) {
      //   // this.cookieService.set('cookie', err.error.text);
      //   this.localStorage.set("cookie", err.error.text);
      //   this.router.navigate(["admin-home", {
      //     cookie: err.error.text
      //   }]);
      // } else {

      // }
    })
    // console.log("clicked")
  }

  getUserDetails() {
    let cookie = this.localStorage.get("cookie");
    let email = this.localStorage.get("email");
    this.authService.getDetails(email).subscribe(data => {

      let loggedInUser = {};
      if (Array.isArray(data)) {
        for (let x of data) {
          if (x.email == email) {
            loggedInUser = x;
          }
        }
      }
      console.log("login details ", loggedInUser);
      // console.Flog("user ", this.loggedInUser);
    }, err => {
      console.log(err);
    })
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  gotoRegister() {
    this.router.navigateByUrl("register");
  }

  gotoDoc() {
    this.router.navigateByUrl("doctor-home");
  }

  gotoDocPatient() {
    this.router.navigateByUrl("doc-patient-info");
  }

  gotoAdmin() {
    this.router.navigateByUrl("admin-home");
  }

  resetPass() {
    this.modalService.open(this.viewListModal).result.then((result) => {

      this.reset.reset();
    }, (reason) => {
      this.reset.reset();
    });
  }

  forgotPassword() {
    this.submitted2 = true;
    if (this.reset.invalid) {
      return;
    }
    // let data = {
    //   "username": this.form.value.username,
    //   "password": this.form.value.password,
    // }
    console.log(this.reset.value.username, location.origin);
    let httpParams = new HttpParams()
      .set('link', location.origin + "/set-password/")
      .set('email', this.reset.value.username);
    this.authService.sendActivationLink(httpParams).subscribe(data => {
      console.log(data);
      this.toastService.toast("Activation link sent successfully. Please check inbox to set password.");
      this.modalService.dismissAll();
    })
    // let body = {
    //   'email': this.reset.value.username,
    //   'password': this.reset.value.password
    // }
    // this.authService.resetPass(body).subscribe(data => {
    //   console.log(data);
    // })
  }

  Close() {
    this.submitted2 = false;
    this.modalService.dismissAll();
  }

  resendLink() {
    if (this.form.value.username.errors) {
      this.toastService.toast("Please enter username and then click here!");
      return;
    }
    let httpParams = new HttpParams()
      .set('link', location.origin + "/set-password/")
      .set('email', this.form.value.username);
    this.authService.sendActivationLink(httpParams).subscribe(data => {
      console.log(data);
      this.toastService.toast("Activation link sent successfully!")
    })
  }
  expired = false;
}
