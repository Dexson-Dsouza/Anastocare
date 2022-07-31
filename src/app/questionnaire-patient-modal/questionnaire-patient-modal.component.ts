import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { QuestionnairePatData } from '../questionnaire-patient/questionnaire-patient.component';
import { DocPatientInfoServiceService } from '../services/doc-patient-info-service.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Toaster } from 'ngx-toast-notifications';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import { LocalStorageService } from 'angular-2-local-storage';



@Component({
  selector: 'app-questionnaire-patient-modal',
  templateUrl: './questionnaire-patient-modal.component.html',
  styleUrls: ['./questionnaire-patient-modal.component.css']
})
export class QuestionnairePatientModalComponent implements OnInit {
  patQuestionnaireList : QuestionnairePatData[] = [];
  timestampLinked : number;
  filteredByTimeList : QuestionnairePatData[] =[];
  ds : MatTableDataSource<QuestionnairePatData>;
  displayedColumns = ['questions', 'answers'];
  curEmail :string;
  docMail: string;

  params = {
    cookie: "",
    email: ""
  };
  
  constructor(public dialogRef: MatDialogRef<QuestionnairePatientModalComponent>,
   public matModel : MatDialog,
   private docService : DocPatientInfoServiceService,
   private httpClient : HttpClient,
   private authService: AuthService,
   private toastr: Toaster,
   private localStorage: LocalStorageService,
    private toastService: ToasterServiceService) { }

    
    // this.params.cookie = this.localStorage.get("cookie");


    // this.params.email = this.localStorage.get("email");

  ngOnInit(): void {
    this.timestampLinked = this.docService.timestampLinked;
    this.patQuestionnaireList = this.docService.patQuestionnaireList;
    console.log("question-modal..."+ JSON.stringify(this.patQuestionnaireList));

    this.docMail = this.docService.docMail;
    this.patQuestionnaireList.forEach(element => {
      this.curEmail = element.email;
        if(this.timestampLinked == element.timestamp){
          if(element.answer=="0"){
            element.answerString= "NO";
          }
          else{
            
            element.answerString= "YES";
          }
          this.filteredByTimeList.push(element);
        }
    })

    this.ds =new MatTableDataSource(this.filteredByTimeList);

  }

  actionFunction() {
    console.log("paramsss -" + this.curEmail);

    this.docMail = this.localStorage.get("email");

    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()

    console.log("paramsss -" +  this.docMail);

    let body = {
      "email" : this.curEmail,
      "doctorMail" : this.docMail,
      "doctorPhone" : 8989898989
    }

    this.authService.sendAlertMail(body).subscribe(data => {
      console.log(data);

      // alert("Email sent to patient");
       this.toastService.toast("Email sent to patient")
    }, err => {
      console.log(err);
    })
    
    // console.log("location origin -"+location.origin);
    this.closeModal();

  }
  
  closeModal() {
    this.dialogRef.close();
  }

}
