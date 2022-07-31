import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import Validation from '../utils/validation';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  token;
  username;
  form;
  showLoader = true;
  expired = false;
  submitted = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToasterServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService
  ) {
    this.form = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }

  get logo() {
    return this.commonService.logo;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.username = params['email'];
      console.log(this.token, this.username);
      if (this.token) {
        let httpParams = new HttpParams()
          .set('token', this.token);
        this.authService.confirmToken(httpParams).subscribe(data => {
          this.showLoader = false;

        }, err => {
          // this.expired = true
          this.showLoader = false;
        })
      } else {
        this.showLoader = false;
        // this.expired = true
      }
    });
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
      "email": this.username,
      "password": this.form.value.password,
      "token": this.token,
    }
    this.authService.setPassword(body).subscribe(data => {
      console.log(data);
      this.toastService.toast(data);
      this.router.navigateByUrl("signin");
    }, err => {
      console.log(err);
    })
  }

}
