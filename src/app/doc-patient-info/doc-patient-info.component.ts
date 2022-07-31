import { Component, OnInit, TemplateRef, ViewChild, Input, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { DocPatientInfoServiceService } from 'src/app/services/doc-patient-info-service.service';
import { QuestionnairePatService } from './../services/questionnaire-pat.service';
import * as Highcharts from 'highcharts';
import * as Highcharts2 from 'highcharts';
import { CommonService } from '../services/common.service';
import { Toaster } from 'ngx-toast-notifications';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import { Options } from '@angular-slider/ngx-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
// import 'hammerjs';

@Component({
  selector: 'app-doc-patient-info',
  templateUrl: './doc-patient-info.component.html',
  styleUrls: ['./doc-patient-info.component.css']
})
export class DocPatientInfoComponent implements OnInit {
  patientObject: any;
  patientName: string;
  patientEmail: string
  docMail: string;
  userID: string;
  riskValue: any;
  defV: number;
  whatever: number = 0;
  defValue: number = 0;
  timeInterval = 0;

  options: Options = {
    floor: 0,
    ceil: 10
  };
  List: string[] = ['Last 4 hours', 'Last 24 hours', 'Last 7 days', 'Last 30 days'];


  constructor(private router: Router,
    private docPatientService: DocPatientInfoServiceService,
    private questionnairePatientService: QuestionnairePatService,
    private authService: AuthService,
    public commonService: CommonService,
    private toastr: Toaster,
    private localStorage: LocalStorageService,
    private toastService: ToasterServiceService

  ) {
    let ts = new Date();
    ts.setHours(ts.getHours() - 4);
    this.timestamp = ts.valueOf();
  }

  ekgData = new Map();
  ekgPlot = []
  params = {
    cookie: "",
    email: ""
  };
  logo = '../../../../assets/logo.PNG'
  default_pic = "assets/profile.jpg"
  uri;



  timestamp;
  getHealthInfo() {
    this.data = [];
    this.authService.getHealthInfo(this.patientEmail).subscribe(data => {

      // console.log(data);
      if (Array.isArray(data)) {
        for (let x of data) {
          {
            let d = new Date(0);
            d.setUTCSeconds(parseFloat(x["timestamp"]));
            x["timestamp"] = d.getTime();
            let n = Date.now();
            if (x["timestamp"] > this.timestamp && x["heartRate"] && x["timestamp"] < n) {
              this.data.push([x["timestamp"], x["heartRate"]]);
            }
          }
        }
        let tempArray = [];
        Array.from(this.ekgData.keys()).forEach(x => {
          tempArray.push([x, 0])
        })
        this.data.sort((a, b) => a[0] - b[0])
        console.log(this.data);
        this.chartOptions = {
          plotOptions: {
            series: {
              // cursor: 'pointer',
              events: {
                click: (event) => this.makeEcgGraph(event)
              }
            }
          },
          series: [
            {
              name: "Heart Rate",
              data: this.data,
              // color: '#808080',
            },
            {
              name: 'EKG',
              type: 'spline',
              data: tempArray,
              color: '#808080',
              lineWidth: 0,
              marker: {
                // width: 16,
                // height: 16,
                enabled: true,
                radius: 7
              },
              tooltip: {
                valueDecimals: 2,
                formatter: function () {
                  var time;
                  time = new Date(this.x);
                  // console.log(this);
                  return "Click to see EKG Graph";
                }
              },
              states: {
                hover: {
                  lineWidthPlus: 0
                }
              }
            }
          ]
        };
        // this.data.sort((a,b) => a[0] - b[0])
        // console.log(this.data.splice(200))
        Highcharts.chart("container", this.chartOptions);
      }
    })
  }


  getEkgInfo() {
    this.data2 = [];
    this.ekgData = new Map();
    this.authService.getHealthInfoEkg(this.patientEmail).subscribe(data => {
      if (Array.isArray(data)) {
        for (let x of data) {
          {
            let d = new Date(0);
            d.setUTCSeconds(parseFloat(x["timestamp"]));
            x["timestamp"] = d.getTime();
            let n = Date.now();
            if (x["timestamp"] > this.timestamp) {
              this.data2.push([x["timestamp"], parseFloat(x["EKG"])]);
            }
          }
        }
        this.data2.sort((a, b) => a[0] - b[0])
        console.log(this.data2);
        let m = new Map();
        this.data2.forEach(x => {
          let d = new Date(x[0]);
          let key = d.toLocaleDateString() + "-" + d.getHours() + "-" + d.getMinutes();
          if (!m.has(key)) {
            m.set(key, []);
          }
          let arr = m.get(key);
          arr.push(x);
          m.set(key, arr)
        })

        let ecgMap = Array.from(m.keys());
        for (let x of ecgMap) {
          let temp = x.split("-");
          let time = new Date(temp[0]);
          time.setHours(parseInt(temp[1]));
          time.setMinutes(parseInt(temp[2]))
          console.log(time.getTime());
          let oneSecBehindTime = time.getTime() - 60000;
          if (this.ekgData.has(oneSecBehindTime)) {
            let arr: Array<any> = this.ekgData.get(oneSecBehindTime);
            arr = arr.concat(m.get(x));
            this.ekgData.set(oneSecBehindTime, arr)
          } else {
            this.ekgData.set(time.getTime(), m.get(x))
          }
        }
        let chartOptions2: any = {
          plotOptions: {
            series: {
              // cursor: 'pointer',
              events: {
                click: function (event) {
                  alert(
                    "H"
                  );
                }
              }
            }
          },
          series: [
            {
              name: "Heart Rate",
              data: this.data,
              // color: '#808080',
            }, {

              name: 'EKG',
              type: 'spline',
              data: [3, 2.67, 3, 6.33, 3.33],
              color: '#808080',
              lineWidth: 0,
              marker: {
                // width: 16,
                // height: 16,
                enabled: true,
                radius: 7
              },
              tooltip: {
                formatter: function () {
                  var time;
                  time = new Date(this.x);
                  // console.log(this);
                  return "Click to see EKG Graph";
                }
              },
              states: {
                hover: {
                  lineWidthPlus: 0
                }
              }
            }]
        };
        // this.data.sort((a,b) => a[0] - b[0])
        // console.log(this.data.splice(200))
        // Highcharts.chart("container", chartOptions2);
      }
    })
  }

  // this.params.cookie = this.localStorage.get("cookie");
  // this.params.email = this.localStorage.get("email");
  defValueMethod() {
    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    this.authService.getRiskFactor(this.patientEmail, headers).subscribe((data) => {

      this.riskValue = JSON.stringify(data);
      this.defValue = this.riskValue;
      console.log("this.patientEmail " + this.patientEmail);
      console.log("defvalue " + this.defValue);

    }, err => {
      console.log(err);
    })
  }

  sliderChange(event) {
    this.defValue = event.value;

    console.log("sliderchanged value" + this.defValue);

    let body = {
      // "email": this.patientEmail,
      "riskFactor": this.defValue
    }

    this.authService.setRiskFactor(body, this.patientEmail).subscribe(data => {

      this.toastService.toast("Risk Factor of the patient updated to: " + this.defValue);
      console.log("Risk Factor of the patient updated to: " + this.defValue);
    }, err => {
      console.log(err);
    })
    // console.log("input slider on change" +JSON.stringify(defV));

  }

  formatThumbLabel(value: number) {

    return value;
  }

  getProfilePic() {
    this.authService.getProfilePic(this.patientEmail).subscribe(data => {
      console.log(data);
      this.uri = 'data:image/jpeg;base64,' + data["picByte"];
    })
  }
  applyFilter(filterValue: string, type) {
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // // if (type == 1) {
    //   this.dataSource.filter = filterValue;
    // } else if (type == 2) {

    //   if (this.patients) {
    //     this.patients.filter = filterValue;
    //   }

  }

  ngOnInit(): void {
    this.patientObject = this.docPatientService.patientData;
    this.patientName = this.patientObject.name;
    this.patientEmail = this.patientObject.email;
    this.userID = this.patientObject.userId;
    this.defValueMethod();

    console.log(this.patientName);
    console.log(this.userID);

    console.log("patient..... " + JSON.stringify(this.patientObject));
    // this.processData();
    // this.generateData();
    this.getHealthInfo();
    this.getEkgInfo();
    // this.processData();
    // this.generateData();

    this.getProfilePic();
    this.chartOptions = {
      series: [
        {
          name: "Heart Rate",
          data: this.data,
          // color: '#808080',
        },

        // {
        //   // color: '#FFFFFF',
        //   name: "EKG",
        //   data: this.data2
        // }
      ]
    };

    Highcharts.setOptions({
      // chart: {
      //   style: {
      //     fontFamily: 'monospace',
      //     color: "#FFFFFF"
      //   },
      //   backgroundColor: '#000000',

      // },
      tooltip: {
        formatter: function () {
          var time;
          time = new Date(this.x);
          // console.log(this);
          if (this.series.name == "EKG") {
            return "Click to see EKG Graph";
          }
          return "Time = " + time.toLocaleTimeString() + "<br> Date = " + time.toLocaleDateString() + "<br>  " + this.series.name + " = " + this.y + "</b>";
        }
      },
      xAxis: {
        crosshair: {
          color: 'green',
          dashStyle: 'Solid'
        },
        type: 'datetime',
        labels: {
          formatter: function () {
            var time;
            time = new Date(this.value);
            return time.getHours() + ":" + time.getMinutes()
          }
        }
      },
      yAxis: {
        // min: this.min,
      },
      title: {
        text: "Heart Rate V/s Time",
      },

    });
    // Highcharts.chart("container", this.chartOptions);
  }

  data: any[] = [];
  data2: any[] = [];
  mergedTime: any;
  mergedValue: any;
  length = 2000;
  count = 0;
  now = 0;
  value = 0;
  timeArray: any[] = [];
  chartOptions: any;
  min = 1000;

  generateData() {
    var now = new Date();
    this.min = 1000;
    for (var i = 0; i < this.length; i++) {
      let y = this.addMoreData() * 10 + 70;
      this.data.push([now.getTime() - (this.length - i) * 3600, y]);
      this.min = Math.min(this.min, y);
      // labels.push(now.toISOString())
    }

    this.count = 0;
    for (var i = 0; i < this.length; i++) {
      let y = this.addMoreData2() * 10 + 50;
      this.data2.push([now.getTime() - (i) * 3600, y]);
      this.min = Math.min(this.min, y);
    }
    this.data2 = this.data2.reverse();
  }

  addMoreData() {
    this.now = this.mergedTime[this.count];
    this.value = this.mergedValue[this.count];
    this.now = Number(this.now);
    this.value = Number(this.value);
    this.count++;
    return this.value;
  }

  addMoreData2() {
    this.now = this.mergedTime[this.count];
    this.value = this.mergedValue[this.count];
    this.now = Number(this.now);
    this.value = Number(this.value);
    this.count++;
    return this.value * 0.4;
  }


  processData() {
    var url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vR73gKau6D4RBTZyiZieAQJUyyX56EeBxxe-giCnqpO1-zLsXjAtPZMJC2CAHwcjdEb4P3tde5UVW0r/pub?gid=1751011686&single=true&output=csv";

    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);

    var csvData = new Array();
    var jsonObject = request.responseText.split(/\r?\n|\r/);
    for (var i = 0; i < jsonObject.length; i++) {
      csvData.push(jsonObject[i].split(","));
    }
    var time = [];
    var value = [];
    var dataValue = [];
    var dataTime = [];
    for (var i = 0; i < csvData.length; i++) {
      time[i] = csvData[i].slice(0, 1);
      value[i] = csvData[i].slice(1, 2);
    }

    for (var i = 2; i <= value.length - 1; i++) {
      dataValue.push(value[i]);
    }
    for (var i = 2; i <= time.length - 1; i++) {
      dataTime.push(time[i]);
    }

    this.mergedValue = [].concat.apply([], dataValue);
    this.mergedTime = [].concat.apply([], dataTime);

    let tempArray = [];
    for (var i = 0; i < this.mergedTime.length; i++) {
      tempArray[i] = this.mergedTime[i].substr(
        2,
        this.mergedTime[i].length - 3
      );
      this.mergedTime[i] = tempArray[i];
    }
  }


  viewReport() {
    //chart stuff
  }

  confirmRecovery() {

    let body = {
      "email": this.patientEmail
    }
    console.log("patient ging in recovered...");
    this.authService.delUser(body).subscribe(data => {
      console.log(data);
      this.toastService.toast("Action completed")
    }, err => {
      console.log(err);
    })
    ///for now marking user as deleted. later add recovered status

  }

  alertPatient() {
    // console.log("location origin -" + location.origin);

    console.log("paramsss -" + this.patientEmail);

    this.docMail = this.localStorage.get("email");

    let c: string = this.localStorage.get("cookie");
    const headers = new HttpHeaders()

    console.log("paramsss -" + this.docMail);

    let body = {
      "email": this.patientEmail,
      "doctorMail": this.docMail,
      "doctorPhone": 8989898989
    }

    this.authService.sendAlertMail(body).subscribe(data => {
      console.log(data);

      // alert("Email sent to patient");
      this.toastService.toast("Email sent to patient")
    }, err => {
      console.log(err);
    })

  }
  changeInterval(s) {
    console.log(this.timeInterval);
    console.log(this.timeInterval)
    let ts = new Date();
    if (this.timeInterval == 0) {
      this.timestamp = ts.valueOf() - 3600000 * 4;
    } else if (this.timeInterval == 1) {
      this.timestamp = ts.valueOf() - 3600000 * 24;
    } else if (this.timeInterval == 2) {
      this.timestamp = ts.valueOf() - 3600000 * 24 * 7;
    } else if (this.timeInterval == 3) {
      this.timestamp = ts.valueOf() - 86400000 * 24 * 30;
    }
    this.getHealthInfo();
    this.getEkgInfo();
  }
  logout() {
    this.router.navigateByUrl("signin");
  }
  gotoHome() {
    this.router.navigateByUrl("doctor-home");
  }
  getQuestionnaire() {
    this.router.navigateByUrl("questionnaire-patient");
  }

  makeEcgGraph(e) {
    if (e.point.y != 0) {
      return
    }
    let ptr = e.point;
    console.log(this.ekgData.get(ptr.x));
    let tempArray = [];
    // Array.from(this.ekgData.keys()).forEach(x => {
    //   tempArray.push([x, 0])
    // })
    // this.data.sort((a, b) => a[0] - b[0])
    // console.log(this.data);
    let temp = this.ekgData.get(ptr.x);
    let data = [];
    let ts = [];
    temp.forEach(x => {
      if (!ts.includes(x[0])) {
        data.push(x);
        ts.push(x[0]);
      }
    })
    data.sort((a, b) => a[0] - b[0]);
    let chartOptions: any = {
      plotOptions: {
        series: {
          // cursor: 'pointer',
          events: {
            click: (event) => this.makeEcgGraph(event)
          }
        }
      },
      series: [
        {
          type: 'spline',
          name: "EKG",
          data: data,
          // color: '#808080',
        }
      ]
    };
    Highcharts2.setOptions({
      // chart: {
      //   style: {
      //     fontFamily: 'monospace',
      //     color: "#FFFFFF"
      //   },
      //   backgroundColor: '#000000',

      // },
      tooltip: {
        formatter: function () {
          var time;
          time = new Date(this.x);
          // console.log(this);

          return "Time = " + time.toLocaleTimeString() + "<br> Date = " + time.toLocaleDateString() + "<br>  " + this.series.name + " = " + this.y + "</b>";
        }
      },
      xAxis: {
        crosshair: {
          color: 'green',
          dashStyle: 'Solid'
        },
        type: 'datetime',
        labels: {
          formatter: function () {
            var time;
            time = new Date(this.value);
            return time.getHours() + ":" + time.getMinutes()
          }
        }
      },
      yAxis: {
        // min: this.min,
      },
      title: {
        text: "Ekg V/s Time",
      },

    });
    // this.data.sort((a,b) => a[0] - b[0])
    // console.log(this.data.splice(200))
    Highcharts.chart("container2", chartOptions);
    let element = document.getElementById("container2");
    element.scrollIntoView();
  }
}
