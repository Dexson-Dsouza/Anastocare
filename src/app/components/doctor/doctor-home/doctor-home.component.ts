import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { DocPatientInfoServiceService } from 'src/app/services/doc-patient-info-service.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toaster } from 'ngx-toast-notifications';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import {MatTabsModule} from '@angular/material/tabs';
// import patientRisk from './../../../_files/patientRisk.json';

// import {} from '../../../../assets/'
@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css'],
  
})
export class DoctorHomeComponent implements OnInit {

  // patientRiskList: PatientRiskInterface[]=patientRisk;
  patientIntList : Patient[] = [];
  patientIntList2 : Patient[] = [];

  loggedInUser = {
    orgId: null,
    userRole: "DOCTOR",
    organisationName: "",
    name : ""
  }
  t_val;
  patientList = [];
  patientList2 = [];
  // patientRiskFactorList: PatientRiskInterface[] = [];
  orgList = []
  questionList = []
  data =[]

  riskFactorPat: any;
  item: number;
  active=0;

  displayedColumns = ['patientName', 'questionnaire', "color"];
  displayedColumns2 = ['patientName', "color"];

  dataSource: MatTableDataSource<Patient>;
  patients: MatTableDataSource<Patient>;
  patients2: MatTableDataSource<Patient>;
  params = {
    cookie: "",
    email: ""
  };s
  logo = '../../../../assets/logo.PNG'
  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    private toastr: Toaster,
    private docPatientService: DocPatientInfoServiceService,
    private toastService: ToasterServiceService,
    private modalService: NgbModal) { 

      this.logo = 'assets/logo.PNG'

      const patient: Patient[] = [];
     

    let patients: Patient[] = []
    this.dataSource = new MatTableDataSource(patients);

      this.patients = new MatTableDataSource(patients);
      this.patients2 = new MatTableDataSource(patients);
      // this.questions = new MatTableDataSource(questions);
      this.params.cookie = this.localStorage.get("cookie");
      this.params.email = this.localStorage.get("email");
      if (this.params.cookie == null) {
        this.router.navigateByUrl("signin");
    }
  }

assignedPatients;
assignedPatients2;


table_user;
val;
openView(val) {

  console.log("here " + val);
  this.docPatientService.patientData = val;
  this.router.navigateByUrl("doc-patient-info");
  // questions: MatTableDataSource<Question>;

  let temp = {
    name: "Kathy Smith",
    email: "kathy@mail.com",
    org_name: "SUNY Buffalo",
    phone: "78945456465",
    type: "USER"
  }
  console.log(val);
  


}

openList(row, type) {
  console.log(row, type);
  this.authService.getDocPatient(this.params.email, {}).subscribe((data) => {
    console.log("success ", data);
    this.assignedPatients = data;
    
    
    //this.modalService.open(this.viewListModal);
  }, err => {
    console.log(err)
  })
}

openInactiveList(row, type) {
  console.log(row, type);
  this.authService.getDocInactivePatients(this.params.email, {}).subscribe((data) => {
    console.log("success ", data);
    this.assignedPatients2 = data;
    
    
    //this.modalService.open(this.viewListModal);
  }, err => {
    console.log(err)
  })
}

gotoDocPatient() {
  this.router.navigateByUrl("doc-patient-info");
}

gotoProfile() {
  this.router.navigateByUrl("view-profile");
}

gotoHome() {
  this.router.navigateByUrl("doctor-home");
}

chooseColor(row) {

// console.log("row"+JSON.stringify(row));

  if (row.patientCondition == "Bad") {
      return "#ff0000"
     }

  else
      return "#00ff00"
    }

  settings = {
    actions: {
      custom: [
        {
          name: 'view',
          title: 'View '
        },
      ],
    },
    columns: {
      id: {
        title: 'Patient ID',
        filter: true
      },
      name: {
        title: 'Patient Name',
        filter: true
      },
      username: {
        title: 'Current Condition',
        filter: false
      }
    }
  };



      source: LocalDataSource;
  
      

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild('addOrg') editModal: TemplateRef<any>;
  @ViewChild('delete') deleteModal: TemplateRef<any>;
  @ViewChild('view') viewModal: TemplateRef<any>;

 
  ngOnInit(): void {
    this.getPatientDetails();
    this.getPatientRiskFactor();
    this.getUserDetails();
    this.docPatientService.docMail = this.params.email;

  }

  logout() {
    this.router.navigateByUrl("signin");
  }

  tabChange(event){
    console.log("evntttt"+event);
  }

  getPatientRiskFactor() {
    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    // .set("Cookie", c)
    .set("Authorization", "JSESSIONID=" + c);

    // console.log("patient list"+this.patientList);
   // this.riskFactorPat 

    this.authService.getRiskFactor(this.params.email, headers).subscribe((data) => {

  if (Array.isArray(data)) {
  }

})

  }

  getPatientDetails() {
    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
    // .set("Cookie", c)
    // .set("Authorization", "JSESSIONID=" + c);
    // headers = headers.append("Cookie", c);
    // headers.getAll('set-cookie');
    this.authService.getDocPatient(this.params.email, headers).subscribe((data) => {
      // console.log(data);
      
      if (Array.isArray(data)) {

        data.sort((x, y) => x.userId - y.userId);
       
        this.patientList = data;
        // console.log("patient list"+this.patientList);
        let patients = [];

          this.patientList.forEach(z => {

          this.authService.getRiskFactor(z.email, headers).subscribe((data) => {
  
          this.riskFactorPat = JSON.stringify(data);
          this.item = this.riskFactorPat;
        
      }, err => {
      console.log(err);
    })
        let pat: Patient = {
          "userId": z.userId,
          "email": z.email,
          "name": z.name,
          "status": z.status,
          "riskFactor": this.item,
          "patientCondition": ""
        };
        this.patientIntList.push(pat);

       }
         )
      
      }
      // this.patientRiskFactorList = JSON.parse(dataRiskFactorListJson);
      this.patientIntList.forEach(element => {


        console.log("riskkk"+element.riskFactor);
        if(element.riskFactor <= 5){
          element.patientCondition="Good";
        }
        else {
          element.patientCondition="Bad";
        }      

       });
       this.patients = new MatTableDataSource(this.patientIntList);
    }, err => {
      console.log(err);
    })

    //inactive patient list......

    this.authService.getDocInactivePatients(this.params.email, headers).subscribe((data) => {
      
      if (Array.isArray(data)) {

        data.sort((x, y) => x.userId - y.userId);
       
        this.patientList2 = data;
        // console.log("patient list"+this.patientList);
        let patients2 = [];

        this.patientList2.forEach(z => {

        let pat2: Patient = {
          "userId": z.userId,
          "email": z.email,
          "name": z.name,
          "status": z.status,
          "riskFactor": 0,
          "patientCondition": ""
        };
        this.patientIntList2.push(pat2);

       }
         )
      
      }
      // this.patientRiskFactorList = JSON.parse(dataRiskFactorListJson);
      this.patientIntList2.forEach(element => {
     

       });
       this.patients2 = new MatTableDataSource(this.patientIntList2);
    }, err => {
      console.log(err);
    })
  }

  getUserDetails() {
    this.authService.getDetails(this.params.email).subscribe(data => {
      // console.log("resp ", data);
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

  applyFilter(filterValue: string, type) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (type == 1) {
      this.dataSource.filter = filterValue;
    } else if (type == 2) {
      
      if (this.patients) {
        this.patients.filter = filterValue;
      }
      
    } 
    // else if (type == 3) {
    //   this.questions.filter = filterValue;
    // }

  }
  onCustom(event) {
    alert(`View Patient profile here`)
    //alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
  }

}


export interface Element {
  "Patient ID": number;
  "Patient Name": string;
  "Current Condition": string;
}


// export interface PatientRiskInterface {
//   email: string;
//   riskFactor: number;
//   patientCondition: string;
// }

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
export interface Patient {
  userId: number;
  name: string;
  email: string,
  status: string;
  riskFactor: number,
  patientCondition: string;
}
export interface Users {
  id: number;
  name: string;
  orgname: string;
  type: string;
  status: string;
}

export interface Question {
  questionId: number;
  description: string;
  answerType: string;

}

const ELEMENT_DATA: Element[] = [
  {"Patient ID": 1, "Patient Name": "abc", "Current Condition": "Good"}
];
