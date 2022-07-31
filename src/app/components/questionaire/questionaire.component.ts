import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';

@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.component.html',
  styleUrls: ['./questionaire.component.css']
})
export class QuestionaireComponent implements OnInit {

  constructor(
    public commonService: CommonService,
    private localStorage: LocalStorageService,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToasterServiceService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  loggedUser;
  questionList;
  submitted = false;
  question_form: FormGroup;

  ngOnInit(): void {
    if (this.localStorage.get("user") == null) {
      this.router.navigateByUrl("signin");
      return;
    }
    this.loggedUser = this.localStorage.get("user");
    if (this.loggedUser && this.loggedUser["userRole"] == "USER") {
      this.getQuestionaire();
      this.question_form = this.formBuilder.group(
        {
          orgId: [],
          name: [null, [Validators.required]],
          gender: [null, [Validators.required]],
        }
      );
    } else {
      this.logout();
    }
  }

  getQuestionaire() {
    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      // .set("Cookie", c)
      .set("Authorization", "JSESSIONID=" + c);
    this.authService.getQuestionaire(headers).subscribe((data) => {
      console.log(data);
      this.questionList = data;
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

  get f(): { [key: string]: AbstractControl } {
    return this.question_form.controls;
  }
  onSubmit() {
    console.log(this.questionList);
    this.submitted = true;
    // this.toastService.toast_danger("Your test results show that you health may be in risk. Please contact your doctor immediately");
    for (let f of this.questionList) {
      if (!f.answer) {
        this.toastService.toast("Please answer all questions!")
        return;
      }
      // f["answer"]=f["description"]
    }
    let n=new Date();
    let body = {
      email: this.loggedUser.email,
      answers: this.questionList,
      timestamp: n.getTime(),
    }
    let score = 0;
    this.questionList.forEach(element => {
      score += parseFloat(element.answer)
    });
    console.log(body);
    this.authService.saveAnswers(body).subscribe(data => {
      console.log(data);

      this.gotoHome();
      if (score >= 0.7 * this.questionList.length) {
        this.toastService.toast_danger("Test results show that your health may be in risk. Please contact your doctor immediately");
      } else {
        this.toastService.toast("Answers saved successfully!");
      }
    }, err => {
      console.log(err);
    })
  }
}
