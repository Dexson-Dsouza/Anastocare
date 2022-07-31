import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toaster } from 'ngx-toast-notifications';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  logo;
  displayedColumns = ['name', 'color'];
  displayedColumns2 = ['name', 'orgname', 'type', 'status', 'color'];
  displayedColumns3 = ['id', 'name', 'color'];
  displayedColumns4 = ['name', 'patientCount', 'status', 'color'];
  displayedColumns5 = ['name', 'assignedDoctor', 'status', 'color'];
  dataSource: MatTableDataSource<UserData>;
  submitted = false;
  thresholdval = 7;
  users: MatTableDataSource<Users>;
  doctors: MatTableDataSource<Doctor>;
  patients: MatTableDataSource<Patient>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addOrg') editModal: TemplateRef<any>;
  @ViewChild('delete') deleteModal: TemplateRef<any>;
  @ViewChild('view') viewModal: TemplateRef<any>;
  @ViewChild('viewList') viewListModal: TemplateRef<any>;
  @ViewChild('editPatientMod') editPatientModal: TemplateRef<any>;
  @ViewChild('threshold') thresholdModal: TemplateRef<any>;
  @ViewChild('viewListOrg') viewListOrgModal: TemplateRef<any>;
  @ViewChild('userOrg') userOrgModal: TemplateRef<any>;
  loggedInUser = {
    orgId: null,
    userRole: "ADMIN",
    organisationName: ""
  }
  t_val;
  userList = []
  orgList = []
  questionList = []
  assignedPatients;
  data = [
    // {
    //   "userId": 3,
    //   "empId": null,
    //   "organisationId": null,
    //   "name": "John Doe",
    //   "username": "john@doe.com",
    //   "phone": null,
    //   "email": "john@doe.com",
    //   "password": null,
    //   "status": "CUR",
    //   "userRole": "DOCTOR"
    // },
    // {
    //   "userId": 2,
    //   "empId": null,
    //   "organisationId": null,
    //   "name": "Jane Doe",
    //   "username": "jane@doe.com",
    //   "phone": null,
    //   "email": "jane@doe.com",
    //   "password": null,
    //   "status": "CUR",
    //   "userRole": "USER"
    // },
    // {
    //   "userId": 4,
    //   "empId": null,
    //   "organisationId": null,
    //   "name": "Jake Doe",
    //   "username": "jake@doe.com",
    //   "phone": null,
    //   "email": "jake@doe.com",
    //   "password": null,
    //   "status": "CUR",
    //   "userRole": "USER"
    // },
    // {
    //   "userId": 5,
    //   "empId": null,
    //   "organisationId": null,
    //   "name": "dexson dsouza",
    //   "username": "ddd@mail.com",
    //   "phone": null,
    //   "email": "ddd@mail.com",
    //   "password": null,
    //   "status": "CUR",
    //   "userRole": "USER"
    // }
  ]
  params = {
    cookie: "",
    email: ""
  };
  questions: MatTableDataSource<Question>;
  question_form: FormGroup;
  userOrg_form: FormGroup;
  user_type = 0;
  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: Toaster,
    private toastService: ToasterServiceService,
    public commonService: CommonService,
  ) {
    this.logo = 'assets/logo.PNG'
    const users: UserData[] = [];
    // for (let i = 1; i <= 100; i++) { users.push(this.createNewUser(i)); }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);

    let patients: Users[] = [
      // {
      //   id: 1,
      //   name: "Sam",
      //   orgname: "UB",
      //   type: "Patient"
      // },
      // {
      //   id: 2,
      //   name: "Jack",
      //   orgname: "UB",
      //   type: "Doctor"
      // },
      // {
      //   id: 3,
      //   name: "Aaron",
      //   orgname: "NYU",
      //   type: "Patient"
      // }
    ]

    // let questions: Question[] = [
    //   {
    //     id: 1,
    //     name: "Feeling Feverish?",
    //   },
    //   {
    //     id: 2,
    //     name: "Feeling Fatigue?",
    //   },
    //   {
    //     id: 3,
    //     name: "Abdomial Pain?",
    //   },
    //   {
    //     id: 4,
    //     name: "Wound Pain?",
    //   },
    //   {
    //     id: 5,
    //     name: "Passing Gas?",
    //   }
    // ]

    this.users = new MatTableDataSource(patients);
    // this.questions = new MatTableDataSource(questions);
    this.params.cookie = this.localStorage.get("cookie");
    this.params.email = this.localStorage.get("email");
    if (this.params.cookie == null) {
      this.router.navigateByUrl("signin");
    }
  }
  patient_form: FormGroup;
  organisation_form: FormGroup;
  admin_form: FormGroup;
  ngOnInit(): void {
    let t = this.localStorage.get("user");
    if (t && t["email"]) {
      this.loggedInUser = this.localStorage.get("user");
    }
    this.commonService.setUser(this.loggedInUser);
    // this.getUserDetails();
    this.getUserList();
    this.getQuestionList();
    if (this.loggedInUser.userRole == "ADMIN") {
      this.getOrganisationList();
      this.getThreshold();
    }
    this.organisation_form = this.formBuilder.group(
      {
        orgId: [],
        description: [
          '',
          [
            Validators.required
          ]
        ]
      }
    );

    this.userOrg_form = this.formBuilder.group(
      {
        orgId: [],
        userId: [null, [Validators.required]],
      }
    );
    this.patient_form = this.formBuilder.group(
      {
        userId: [null],
        // name: [
        //   '',
        //   [
        //     Validators.required
        //   ]
        // ], lname: [
        //   '',
        //   [
        //     Validators.required
        //   ]
        // ],
        // email: ['', [Validators.required, Validators.email]],
        // phone: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        Doctor: [null, Validators.compose([Validators.required])],
      }
    );
    this.admin_form = this.formBuilder.group(
      {
        userId: [null],
        name: [
          '',
          [
            Validators.required
          ]
        ], lname: [
          '',
          [
            Validators.required
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        OrganisationId: [null, Validators.compose([Validators.required])],
      }
    );

    this.question_form = this.formBuilder.group(
      {
        questionId: [],
        description: [
          '',
          [
            Validators.required
          ]
        ], questionOrder: [
          '1',
          [
            // Validators.required
          ]
        ], answerType: [
          null,
          [
            Validators.required
          ]
        ],
      }
    );
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrganisationList() {
    this.authService.getOrganizations({}).subscribe((data) => {
      console.log(data);

      if (Array.isArray(data)) {
        data.sort((x, y) => x.orgId - y.orgId);
        this.orgList = data;
        let user_org_list = [];
        for (let x of data) {
          let org: UserData = x;
          org.name = x.description;
          user_org_list.push(org);
        }
        this.dataSource = new MatTableDataSource(user_org_list);
      }
    }, err => {
      console.log(err);
    })
  }

  getUserList() {
    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
    // .set("Cookie", c)
    // .set("Authorization", "JSESSIONID=" + c);
    // headers = headers.append("Cookie", c);
    // headers.getAll('set-cookie');
    this.authService.getUserList(headers).subscribe((data) => {
      console.log(data);
      if (Array.isArray(data)) {
        data.sort((x, y) => x.userId - y.userId);
        this.userList = data;
        let patients = [];
        if (Array.isArray(data)) {
          for (let x of data) {
            if (x.email == this.params.email) {
              this.loggedInUser = x;
            }
          }
        }
        console.log("user ", this.loggedInUser)
        if (this.loggedInUser.userRole == "LOCAL_ADMIN") {
          for (let x of data) {
            let user: Users = x;
            user.id = x.userId;
            user.type = x.userRole;
            user.orgname = x.organisationName ? x.organisationName : "Unmapped";
            if (this.loggedInUser.orgId == x.orgId) {
              patients.push(user);
            }
          }
        } else {
          for (let x of data) {
            let user: Users = x;
            user.id = x.userId;
            user.type = x.userRole;
            user.orgname = x.organisationName ? x.organisationName : "Unmapped";
            patients.push(user);
          }
        }
        let doc_list = [];
        let pat_list = [];
        if (this.loggedInUser.userRole == "LOCAL_ADMIN") {

          patients.forEach(x => {
            if (x.userRole == "USER") {
              let temp: Patient = x;
              if (x.assignedDoctors && x.assignedDoctors.length > 0) {
                let __t = x.assignedDoctors[0].split(":");
                temp.assignedDoctor = __t[1].trim();
                temp["Doctor"] = __t[0].trim();
              } else {
                temp.assignedDoctor = "UNASSIGNED";
              }
              temp.name = x.name;
              temp.userId = x.id;
              temp.status = x.status;
              pat_list.push(temp);
            } else if (x.userRole == "DOCTOR") {
              let temp: Doctor = x;
              temp.patientCount = x.patientCount ? x.patientCount : 0;
              temp.name = x.name;
              temp.userId = x.id;
              temp.status = x.status;
              doc_list.push(temp);
            }
          })
          this.docList = doc_list;
          this.doctors = new MatTableDataSource(doc_list);
          this.patients = new MatTableDataSource(pat_list);
        } else {
          this.users = new MatTableDataSource(patients);
        }
        console.log(pat_list, doc_list);
      }
    }, err => {
      console.log(err);
    })
  }
  docList = []
  getQuestionList() {
    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      // .set("Cookie", c)
      .set("Authorization", "JSESSIONID=" + c);
    // headers = headers.append("Cookie", c);
    // headers.getAll('set-cookie');
    this.authService.getQuestionaire(headers).subscribe((data) => {
      console.log(data);

      if (Array.isArray(data)) {
        data.sort((a, b) => a.questionId - b.questionId)
        this.questionList = data;
        let questions: Question[] = [
          {
            questionId: 1,
            description: "Feeling Feverish?",
            answerType: "Binary",
          }
        ]
        let user_org_list = [];
        for (let x of data) {
          let org: Question = x;
          org.questionId = x.questionId;
          org.description = x.description;
          org.answerType = x.answerType;
          user_org_list.push(org);
        }
        this.questions = new MatTableDataSource(this.questionList);
        //   data.sort((x, y) => x.userId - y.userId);
        //   this.userList = data;
        //   let patients = [];
        //   for (let x of data) {
        //     let user: Users = x;
        //     user.id = x.userId;
        //     user.type = x.userRole;
        //     user.orgname = x.organisationName ? x.organisationName : "SUNY Buffalo";
        //     patients.push(user);
        //   }
        //   this.users = new MatTableDataSource(patients);
      }
    }, err => {
      console.log(err);
    })
  }

  createNewUser(id: number): UserData {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: id.toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }

  applyFilter(filterValue: string, type) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (type == 1) {
      this.dataSource.filter = filterValue;
    } else if (type == 2) {
      if (this.users) {
        this.users.filter = filterValue;
      }
      if (this.patients) {
        this.patients.filter = filterValue;
      }
      if (this.doctors) {
        this.doctors.filter = filterValue;
      }
    } else if (type == 3) {
      this.questions.filter = filterValue;
    }

  }

  logout() {
    this.router.navigateByUrl("signin");
  }

  viewQuestionaire() {

    this.router.navigateByUrl("view-questionaire");
  }
  title = '';
  type;
  closeResult: string;

  open(content, type) {
    this.edit_data = false;
    this.type = type;
    if (type == 1) {
      this.title = "Add Organisation";
    } else if (type == 2) {
      this.title = "Add User";
      if (this.loggedInUser.userRole == "LOCAL_ADMIN") {
        this.title = "Add Doctor";
      }
    } else if (type == 3) {
      this.title = "Add Question";
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.resetForms();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.resetForms();
    this.submitted = false;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  savepatient() {
    this.submitted = true;
    if (this.patient_form.invalid) {
      return;
    }
    let body = {
      "patientId": this.patient_form.value.userId,
      "doctorId": parseInt(this.patient_form.value.Doctor)
    };
    console.log(body);
    this.authService.mapDocAndPatient(body).subscribe(data => {
      console.log(data);
      this.modalService.dismissAll();
      this.getUserList();
    }, err => {
      console.log(err);
    })
  }
  saveQuestion() {
    this.submitted = true;
    if (this.question_form.invalid) {
      return;
    }

    let body = this.question_form.value;
    body["questionOrder"] = this.question_form.value.questionOrder ? this.question_form.value.questionOrder : this.questionList.length + 1;
    this.authService.addEditQeustion(body).subscribe(data => {
      console.log("sucess ", data);
      this.modalService.dismissAll();
      if (this.question_form.value.questionId != null) {
        this.toastService.toast("Question edited  successfully");
      } else {
        this.toastService.toast("Question added successfully");
      }

      this.getQuestionList();
    }, err => {
      console.log(err);
    })
  }

  saveDoctor() {
    console.log(this.admin_form.value);
    this.submitted = true;
    if (!this.admin_form.controls.OrganisationId.value) {

      this.admin_form.get('OrganisationId').setValue(this.loggedInUser.orgId);
      // this.admin_form.controls.OrganisationId.markAsTouched();
      this.admin_form.controls['OrganisationId'].setErrors(null);
    }
    if (this.admin_form.invalid) {
      return;
    }
    let body = {
      "firstName": this.admin_form.value.name,
      "lastName": this.admin_form.value.lname,
      "email": this.admin_form.value.email,
      "password": this.admin_form.value.name + "123",
      "phone": this.admin_form.value.phone,
      "OrganisationId": this.admin_form.value.OrganisationId,
      'link': location.origin + "/set-password/"
    }

    if (this.admin_form.value.userId) {
      body["userId"] = this.admin_form.value.userId;
    }
    this.authService.addDoctor(body).subscribe(data => {
      console.log("sucess ", data);
      this.modalService.dismissAll();
      if (body["userId"]) {
        this.toastService.toast("Doctor Edited successfully");
      } else {
        this.toastService.toast("Doctor registered successfully");
      }

      this.getUserList();
    }, err => {
      console.log(err);
    })
  }

  addGlobalAdmin() {
    this.admin_form.get('OrganisationId').setValue(5);
    if (this.admin_form.invalid) {
      return;
    }
    let body = {
      "firstName": this.admin_form.value.name,
      "lastName": this.admin_form.value.lname,
      "email": this.admin_form.value.email,
      // "password": this.admin_form.value.name + "123",
      "phone": this.admin_form.value.phone,
      'link': location.origin + "/set-password/"
      // "OrganisationId": this.admin_form.value.OrganisationId,
    }
    if (this.admin_form.value.userId) {
      body["userId"] = this.admin_form.value.userId;
    }
    this.authService.addGlobalAdmin(body).subscribe(data => {
      console.log("sucess ", data);
      this.modalService.dismissAll();
      this.toastService.toast("Global Admin added successfully");
      this.getUserList();
    }, err => {
      console.log(err);
    })

  }

  saveAdmin() {
    console.log(this.user_type)
    if (this.loggedInUser.userRole == "LOCAL_ADMIN" || this.user_type == 0) {
      this.saveDoctor();
      return;
    }
    console.log(this.admin_form.value);
    this.submitted = true;
    if (this.user_type == 2) {
      this.addGlobalAdmin();
      return;
    }
    if (this.admin_form.invalid) {
      return;
    }
    let body = {
      "firstName": this.admin_form.value.name,
      "lastName": this.admin_form.value.lname,
      "email": this.admin_form.value.email,
      "password": this.admin_form.value.name + "123",
      "phone": this.admin_form.value.phone,
      "OrganisationId": this.admin_form.value.OrganisationId,
      'link': location.origin + "/set-password/",
    }

    if (this.admin_form.value.userId) {
      body["userId"] = this.admin_form.value.userId;
    }
    this.authService.addEditAdmin(body).subscribe(data => {
      console.log("sucess ", data);
      this.modalService.dismissAll();
      if (body["userId"]) {
        this.toastService.toast("Admin edited successfully");
      } else {
        this.toastService.toast("Admin added successfully");
      }
      this.getUserList();
    }, err => {
      console.log(err);
    })

  }

  saveOrganisation() {
    this.submitted = true;
    if (this.organisation_form.invalid) {
      return;
    }
    let record = this.orgList.find((x) => x.description == this.organisation_form.value.description);
    let body = {
      orgId: this.organisation_form.value.orgId,
      description: this.organisation_form.value.description
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
      .set("Accept", "application/text");
    console.log(body)
    this.authService.addEditOrganization(body, headers).subscribe((data) => {
      this.getOrganisationList();
      this.toast("Saved Successfully!");
      console.log(data);
    }, err => {
      console.log(err);
    })
    this.modalService.dismissAll();
  }
  resetForms() {
    this.submitted = false;
    this.organisation_form.reset();
    this.admin_form.reset();
    this.question_form.reset();
    this.patient_form.reset();
    this.assignedPatients = null;
    this.userOrg_form.reset();
  }

  Close() {
    this.resetForms();
    this.submitted = false;
    this.modalService.dismissAll();
  }

  delete_confirm(val, type) {
    console.log(val);
    this.type = type;
    let form = {};
    if (type == 1) {
      form["description"] = val.description;
      form["orgId"] = val.orgId;
      this.organisation_form.setValue(form);
      this.title = "Delete Organisation";
    } else if (type == 2) {
      let names = val.name.split(" ");
      form["userId"] = val.userId;
      form["email"] = val.email;
      form["name"] = names[0];
      form["lname"] = names[names.length - 1]
      form["phone"] = val.phone;
      form["OrganisationId"] = val.orgId;
      this.admin_form.setValue(form);
      this.title = "Delete Account";
    } else if (type == 3) {
      form["answerType"] = val.answerType;
      form["description"] = val.description;
      form["questionId"] = val.questionId;
      form["questionOrder"] = val.questionOrder;

      this.question_form.setValue(form);
      this.title = "Delete Question";
    }
    this.modalService.open(this.deleteModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.resetForms();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  temp;
  editPatient(val, type) {
    console.log(val);
    this.temp = val;
    this.modalService.open(this.editPatientModal).result.then((result) => {
      this.resetForms();
    }, (reason) => {
      this.resetForms();
    });
    let names = val.name.split(" ");
    let body = {
      userId: val.userId,
      // name: names[0],
      // lname: names[1],
      // email: val.email,
      // phone: val.phone,
      Doctor: val.Doctor ? val.Doctor : null
    }
    this.patient_form.setValue(body);
  }
  edit_data;
  edit(val, type) {
    this.edit_data = true;
    console.log(val);
    if (val.userRole == "USER") {
      this.openUserMapping(val);
      return;
    }
    this.type = type;
    let form = {};
    if (type == 1) {
      form["orgId"] = val.orgId;
      form["description"] = val.description;
      this.organisation_form.setValue(form);
      this.title = "Edit Organisation";
    } else if (type == 2) {
      if (val.userRole == "DOCTOR") {
        this.user_type = 0;
      } else if (val.userRole == "LOCAL_ADMIN") {
        this.user_type = 1;
      } else if (val.userRole == "ADMIN") {
        this.user_type = 2;
      }

      let names = val.name.split(" ");
      form["userId"] = val.userId;
      form["email"] = val.email;
      form["name"] = names[0];
      form["lname"] = names[names.length - 1]
      form["phone"] = val.phone;
      form["OrganisationId"] = val.orgId;
      this.admin_form.setValue(form);
      this.title = "Edit Account";
    } else if (type == 3) {
      form["questionId"] = val.questionId;
      form["description"] = val.description;
      form["answerType"] = val.answerType;
      form["questionOrder"] = val.questionOrder ? val.questionOrder : this.questionList.length + 1;
      this.question_form.setValue(form);
      this.title = "Edit Question";
    }
    this.modalService.open(this.editModal).result.then((result) => {
      this.resetForms();
    }, (reason) => {
      this.resetForms();
    });
  }

  toast(msg) {
    this.toastr.open({
      text: msg,
      type: "dark",
      duration: 3000,
      position: 'bottom-center'
    });
  }

  deleteOrganisation() {
    console.log("DELETE", this.organisation_form.value);
    let body = this.organisation_form.value;
    // if (typeof (body.orgId) == "number")
    //   body.orgId = body.orgId.toString();
    this.authService.delOrganization(body).subscribe(data => {
      console.log(data);
      this.getOrganisationList();
      this.getUserList();
      this.toast("Delete Successful!");
      this.modalService.dismissAll();
    }, err => {
      console.log(err);
    })
  }

  deleteAdmin() {
    console.log("DELETE", this.admin_form.value);
    let body = {
      "firstName": this.admin_form.value.name,
      "lastName": this.admin_form.value.lname,
      "email": this.admin_form.value.email,
      "password": this.admin_form.value.name + "123",
      "phone": this.admin_form.value.phone,
      "OrganisationId": this.admin_form.value.OrganisationId,
    }
    if (this.admin_form.value.userId) {
      body["userId"] = this.admin_form.value.userId;
    }
    this.authService.delUser(body).subscribe(data => {
      console.log("sucess  del ", data);
      this.getUserList();
      this.modalService.dismissAll();
      this.toastService.toast("User deleted successfully");
    }, err => {
      console.log(err);
    })
  }

  deleteQues() {
    console.log("DELETE", this.question_form.value);
    let body = this.question_form.value;
    if (typeof (body.orgId) == "number")
      body.orgId = body.orgId.toString();
    this.authService.delQuestion(body).subscribe(data => {
      console.log(data);
      this.getQuestionList();
      this.toast("Delete Successful!");
      this.modalService.dismissAll();
    }, err => {
      console.log(err);
    })
  }

  table_user;
  openView(val) {

    let temp = {
      name: "Dexson Dsouza",
      email: "dexson@mail.com",
      org_name: "SUNY Buffalo",
      phone: "78945456465",
      type: "USER"
    }
    this.authService.getDetails(val.email).subscribe(data => {
      let val = data[0];
      let form = {};
      let names = val.name.split(" ");
      form["email"] = val.email;
      form["name"] = names[0];
      form["lname"] = names[names.length - 1];
      form["phone"] = val.phone;
      form["type"] = val.userRole;
      form["org_name"] = val.organisationName ? val.organisationName : null;
      // this.admin_form.setValue(form);
      this.table_user = form
      this.modalService.open(this.viewModal);
    }, err => {
      this.table_user = temp;
      console.log(this.table_user)
      this.modalService.open(this.viewModal);
      // this.toast("Unable to get Information");
    })

  }

  openList(row, type) {
    console.log(row, type);
    this.authService.getDocPatient(row.email, {}).subscribe((data) => {
      console.log("success ", data);
      this.assignedPatients = data;
      this.modalService.open(this.viewListModal);
    }, err => {
      console.log(err)
    })
  }

  EditThreshold() {
    this.thresHoldError = false;
    this.t_val = this.thresholdval;
    this.modalService.open(this.thresholdModal);
  }

  thresHoldError = false;
  checkrange(val) {
    if (!val || val <= 0 || val >= 10) {
      this.thresHoldError = true;
    } else {
      this.thresHoldError = false;
    }
  }
  saveThresHold() {
    console.log(this.t_val);
    if (!this.t_val || this.t_val <= 0 || this.t_val >= 10) {
      this.thresHoldError = true;
      return;
    }
    let body = {
      "threshold": this.t_val
    }
    this.authService.setThreshold(body).subscribe(data => {
      this.modalService.dismissAll();
      this.toastService.toast("Threshold value updated!")
      this.thresholdval = this.t_val;
      console.log("thres sett ", data);
    })
  }

  send_link(row) {
    console.log(row, location.origin);
    let httpParams = new HttpParams()
      .set('link', location.origin + "/set-password/")
      .set('email', row.email);
    this.authService.sendActivationLink(httpParams).subscribe(data => {
      console.log(data);
      this.toastService.toast("Activation link sent successfully!")
    })
  }
  org_admins = [];
  org_docs = [];
  view_list_org(row) {
    console.log("open ", row, this.userList);
    this.org_admins = [];
    this.org_docs = [];
    this.userList.forEach(element => {
      if (element.orgId == row.orgId) {
        if (element.userRole == "DOCTOR") {
          this.org_docs.push(element);
        } else if (element.userRole == "LOCAL_ADMIN") {
          this.org_admins.push(element);
        }
      }
    });
    this.modalService.open(this.viewListOrgModal).result.then((result) => {

    }, (reason) => {
    });
  }

  changed($event) {
    console.log($event.target.value)
  }

  getThreshold() {
    this.authService.getThreshold().subscribe(data => {
      console.log("thres ", data);
      this.thresholdval = Number(data);
    })
  }

  openUserMapping(val) {
    this.temp = val;
    console.log(val);
    let body = {
      userId: val.email,
      orgId: val.orgId ? val.orgId : null
    }
    this.userOrg_form.setValue(body);
    this.modalService.open(this.userOrgModal).result.then(data => {
      this.resetForms();
    }, err => {
      this.resetForms();
    })
  }

  mapUserOrg() {
    this.submitted = true;
    console.log(this.userOrg_form.value);
    if (this.userOrg_form.invalid) {
      return;
    }
    let body = this.userOrg_form.value;
    body["email"] = body.userId;
    this.authService.setUserOrg(body).subscribe(data => {
      console.log(data);
      this.toastService.toast("User Mapped Successfully!");
      this.getUserList();
      this.modalService.dismissAll();
    })
  }
}


/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
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
export interface Doctor {
  userId: number;
  name: string;
  patientCount: string;
  status: string;
}
export interface Patient {
  userId: number;
  name: string;
  assignedDoctor: string;
  status: string;
}