import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from 'src/app/components/utils/validation';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterServiceService } from '../../services/toaster-service.service'
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  docList;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastService: ToasterServiceService,
    private authService: AuthService
  ) {
  }

  searchVal;
  selectedDoc;

  onKey(value) {
    this.selectedDoc = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.docList.filter(option => option.name.toLowerCase().startsWith(filter));
  }

  getUserList() {
    this.authService.getDoctors().subscribe((data) => {
      console.log(data);
      if (Array.isArray(data)) {
        this.docList = [];
        data.sort((x, y) => x.userId - y.userId);
        for (let x of data) {
          if (x.userRole == "DOCTOR") {
            this.docList.push(x);
          }
        }
      }
      this.selectedDoc = this.docList;
    }, err => {
      console.log(err);
    })
  }

  ngOnInit(): void {
    this.getUserList();
    this.form = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        username: [
          '',
          [
            Validators.required
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        Doctor: [null, Validators.compose([Validators.required])],
        phone: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
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
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let data = {
      "firstName": this.form.value.fullname,
      "lastName": this.form.value.username,
      "email": this.form.value.email,
      "password": this.form.value.password,
      "phone": this.form.value.phone,
      "doctorEmail": this.form.value.Doctor
    }

    console.log(data);
    // return;
    console.log(JSON.stringify(this.form.value, null, 2));
    this.http.post(environment.url + 'api/v1/registration/user', data, { responseType: 'text' })
      .subscribe((result) => {
        console.log("result", result);
        this.toastService.toast('Registration Successful!, Please check your inbox and Activate your account');
        this.router.navigate(['/signin']);
      })

  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  gotoLogin() {
    this.router.navigateByUrl("signin");
  }

}
