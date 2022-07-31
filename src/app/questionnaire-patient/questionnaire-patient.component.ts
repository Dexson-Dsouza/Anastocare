import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionnairePatService } from './../services/questionnaire-pat.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DocPatientInfoServiceService } from '../services/doc-patient-info-service.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocalStorageService } from 'angular-2-local-storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuestionnairePatientModalComponent } from '../questionnaire-patient-modal/questionnaire-patient-modal.component';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-questionnaire-patient',
  templateUrl: './questionnaire-patient.component.html',
  styleUrls: ['./questionnaire-patient.component.css']
})
export class QuestionnairePatientComponent implements OnInit {


  data = [];
  questionnairePatSerList: QuestionnairePatInt[] = [];
  questionnairePatIntList: QuestionnairePatData[] = [];
  someList: [] = [];
  dataSource: MatTableDataSource<QuestionnairePatInt>;
  displayedColumns = ['dateTaken', 'timeTaken', 'view'];
  closeResult: string;
  logo = '../../../assets/logo.PNG'

  constructor(private router: Router,
    private httpClient: HttpClient,
    private questionnairePatientService: QuestionnairePatService,
    private docPatientService: DocPatientInfoServiceService,
    private localStorage: LocalStorageService,
    private modalService: NgbModal,
    public matDialog: MatDialog,
    private authService: AuthService,
  ) { }

  patEmail: any;
  PatName: any;

  patientQuestionObject: any;



  ngOnInit(): void {



    let set: Set<number> = new Set<number>();



    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      // .set("Cookie", c)
      .set("Authorization", "JSESSIONID=" + c);
    // console.log(" questionnaire pat starttt");
    this.patientQuestionObject = this.docPatientService.patientData;
    // console.log("from questionaire patient ......" + JSON.stringify(this.patientQuestionObject));

    this.patEmail = this.patientQuestionObject.email;
    this.PatName = this.patientQuestionObject.name;
    this.docPatientService.patEmail = this.patEmail;



    //  .........................................................................................
    this.authService.getQuestionaire({}).subscribe((d) => {
      // console.log("questions data" + d);
      if (Array.isArray(d)) {
        this.questionnairePatIntList = d;
      }

    })
    this.docPatientService.getQuestionnairePatByEmail(this.patEmail, {}).subscribe((data) => {
      // console.log("...questionnaire" + data);


      if (Array.isArray(data)) {
        this.questionnairePatIntList = data;
      }
      //  console.log("this......" +this.questionnairePatIntList);
      //  const unixTime = data.timestamp;
      // const date = new Date(unixTime*1000);
      // console.log(date.toLocaleDateString("en-US"));

      //   this.someList = data;

      // this.someList.forEach(element => {
      // console.log(element);

      //   this.questionnairePatSerList.push(element.time);
      //   this.questionnairePatSerList.push(element.date);


      // });


      this.questionnairePatIntList.forEach(element => {


        // const unixTime = element.timestamp;
        const unixTime = element.timestamp;
        const unixDate = new Date(0);
        const tempDate = new Date(unixTime * 1000);

        // console.log("tempdate" + tempDate);


        unixDate.setUTCSeconds(unixTime);

        // unixDate = unixDate.getFullYear, unixDate.getMonth, unixDate.getDate);
        // console.log("unix date " + unixDate);
        // const Unixdate = new Date(unixTime*1000);
        // console.log("..... time " +unixTime.toLocaleDateString("en-US"));
        // console.log("..... date " + unixDate.toLocaleDateString("en-US"));
        // console.log("..... time " + unixDate.toLocaleTimeString("en-US"));



        let humantime = unixDate.toLocaleTimeString("en-US");
        // console.log("utimeee " + humantime);
        let date = new Date(element.timestamp);
        // date.setUTCSeconds(element.timestamp);
        // date.setTime(element.timestamp);
        let list: QuestionnairePatInt = {
          "date": date.toLocaleString(),
          "time": this.formatTime(date),
          "timestamp": unixTime
        };

        if (!set.has(unixTime)) {

          this.questionnairePatSerList.push(list);
          set.add(unixTime);
        }


        // if(!(this.questionnairePatSerList.includes(list))){
        //   console.log("pushing.. "+list);
        //   this.questionnairePatSerList.push(list);
        // }


      })
      this.questionnairePatSerList.sort((a, b) => b["timestamp"] - a["timestamp"]);
      this.dataSource = new MatTableDataSource(this.questionnairePatSerList);
      console.log(this.questionnairePatIntList)
    }, err => {
      console.log(err)
    })



  }

  formatDate(newDate) {

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours().toString();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
      sAMPM = "PM";
      sHour = (iHourCheck - 12).toString();
    }
    else if (iHourCheck === 0) {
      sHour = "12";
    }

    sHour = this.padValue(sHour);

    return sMonth + "-" + sDay + "-" + sYear;
  }

  formatTime(newDate) {
    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours().toString();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
      sAMPM = "PM";
      sHour = (iHourCheck - 12).toString();
    }
    else if (iHourCheck === 0) {
      sHour = "12";
    }

    sHour = this.padValue(sHour);
    return sHour + ":" + sMinute + " " + sAMPM;
  }
  padValue(value) {
    return (value < 10) ? "0" + value : value;
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  logout() {
    this.router.navigateByUrl("signin");
  }


  table_user;
  val;

  openView(val) {

    console.log("here " + val);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "questionnaire-patient-modal-component";
    dialogConfig.height = "500px";
    dialogConfig.width = "600px";
    this.docPatientService.timestampLinked = val.timestamp;
    this.docPatientService.patQuestionnaireList = this.questionnairePatIntList;
    const modalDialog = this.matDialog.open(QuestionnairePatientModalComponent, dialogConfig);
  }


  gotoHome() {
    this.router.navigateByUrl("doctor-home");
  }



}
export interface QuestionnairePatInt {
  time: string;
  date: string;
  timestamp: number;

}

export interface QuestionnairePatData {
  questionId: number;
  answer: string;
  questions: string;
  email: string;
  qpId: number;
  timestamp: number;
  question: string;
  answerString?: string;
}