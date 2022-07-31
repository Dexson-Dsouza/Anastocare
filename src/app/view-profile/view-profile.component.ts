import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'angular-2-local-storage';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ToasterServiceService } from '../services/toaster-service.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  @ViewChild('EditProfile') EditProfile: TemplateRef<any>;
  constructor(
    public commonService: CommonService,
    private localStorage: LocalStorageService,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToasterServiceService,
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
  ) { }
  form: FormGroup;
  submitted = false;
  loggedUser;
  default_pic = "assets/profile.jpg"
  ngOnInit(): void {
    if (this.localStorage.get("user") == null) {
      this.router.navigateByUrl("signin");
      return;
    }
    this.loggedUser = this.localStorage.get("user");
    this.commonService.setUser(this.loggedUser);
    console.log(this.loggedUser);
    let names: string[] = this.loggedUser.name.split(" ");
    let arr1: string[] = names;
    let lname = arr1.pop();
    this.loggedUser["fname"] = arr1.join(" ");
    this.loggedUser["lname"] = lname;

    this.form = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        username: [
          '',
          [
            Validators.required
          ]
        ],
        phone: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
      }
    );
    this.getProfilePic();
    this.getDoctorInfo();
  }

  getDoctorInfo() {
    this.authService.getDoctorInfo(this.loggedUser.email).subscribe(data => {
      // console.log(data, " -====== ")
      this.loggedUser["assignedDoctors"] = data;
    })
  }

  getProfilePic() {
    this.authService.getProfilePic(this.loggedUser.email).subscribe(data => {
      console.log(data);
      this.uri = 'data:image/jpeg;base64,' + data["picByte"];
    })
  }

  logout() {
    this.router.navigateByUrl("signin");
  }
  gotoProfile() {
    this.router.navigateByUrl("view-profile");
  }

  gotoHome() {
    if(this.loggedUser.userRole == "DOCTOR"){
      this.router.navigateByUrl("doctor-home");
    }
    else{
      this.router.navigateByUrl("patient-home");
    }
    
  }

  openEditModal() {
    let body = {
      fullname: this.loggedUser.fname,
      username: this.loggedUser.lname,
      phone: this.loggedUser.phone,
    }
    this.form.setValue(body);
    this.modalService.open(this.EditProfile);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    let body = {
      email: this.loggedUser.email,
      firstName: this.form.value.fullname,
      lastName: this.form.value.username,
      phone: this.form.value.phone
    }
    this.authService.updateProfile(body).subscribe(data => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getUserDetails();
      console.log("resp ", data);
      this.toastService.toast("Data saved successfully!");
    })
  }

  getUserDetails() {
    this.authService.getDetails(this.loggedUser.email).subscribe(data => {
      let loggedInUser = {};
      if (Array.isArray(data)) {
        for (let x of data) {
          if (x.email == this.loggedUser.email) {
            loggedInUser = x;
          }
        }
      }
      console.log("new details ", loggedInUser);

      let names: string[] = loggedInUser["name"].split(" ");
      let arr1: string[] = names;
      let lname = arr1.pop();
      loggedInUser["fname"] = arr1.join(" ");
      loggedInUser["lname"] = lname;
      this.commonService.setUser(loggedInUser);
      this.localStorage.set("user", loggedInUser);
      this.loggedUser = loggedInUser;
      this.getDoctorInfo();
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  fileBlob;
  selectedFile: File;

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }
  retrievedImage: any;
  upload() {

    console.log(this.selectedFile);
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

    this.retrievedImage = 'data:image/jpeg;base64,' + uploadImageData;
    this.authService.upload(this.loggedUser.email, uploadImageData).subscribe((response) => {
      this.toastService.toast("Image saved sucessfully!");
    });


    var reader = new FileReader();

    reader.readAsDataURL(this.selectedFile); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.retrievedImage = event.target.result;
      this.uri = this.domSanitizer.bypassSecurityTrustUrl(this.retrievedImage);
      this.selectedFile = null;
    }
    // this.retrievedImage = this.domSanitizer.bypassSecurityTrustUrl(this.retrievedImage);

  }
  uri;
  getImage() {
    // this.authService.getImage().subscribe(res => {
    //   this.retrieveResonse = res;
    //   this.base64Data = this.retrieveResonse.picByte;
    //   this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
    // });
  }
}
