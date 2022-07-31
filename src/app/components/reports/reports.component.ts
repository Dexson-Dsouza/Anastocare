import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'angular-2-local-storage';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  timeInterval = 0;

  List: string[] = ['Last 4 hours', 'Last 24 hours', 'Last 7 days', 'Last 30 days'];
  ekgData = new Map()
  ekgPlot = []
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
  loggedUser;
  constructor(
    public commonService: CommonService,
    private localStorage: LocalStorageService,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToasterServiceService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    if (this.localStorage.get("user") == null) {
      this.router.navigateByUrl("signin");
      return;
    }
    let ts = new Date();
    this.timestamp = ts.getTime() - 3600000 * 4;
    this.loggedUser = this.localStorage.get("user");

    this.processData();
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

    this.getHealthInfo();
    this.getEkgInfo();
  }
  min = 1000;
  timestamp;
  getHealthInfo() {
    this.data = [];
    this.authService.getHealthInfo(this.loggedUser.email).subscribe(data => {

      // console.log(data);
      if (Array.isArray(data)) {
        for (let x of data) {
          {
            let d = new Date(0);
            d.setUTCSeconds(parseFloat(x["timestamp"]));
            x["timestamp"] = d.getTime();
            if (x["timestamp"] > this.timestamp && x["heartRate"]) {
              this.data.push([x["timestamp"], x["heartRate"]]);
            }
          }
        }
        this.data.sort((a, b) => a[0] - b[0])
        console.log(this.data);
        this.chartOptions = {
          plotOptions: {
            series: {
              // cursor: 'pointer',
              events: {
                click: function (event) {
                  console.log(event);
                }
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
              // data: [Array.from(this.ekgData.keys())],
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
    this.authService.getHealthInfoEkg(this.loggedUser.email).subscribe(data => {
      if (Array.isArray(data)) {
        for (let x of data) {
          {
            let d = new Date(0);
            d.setUTCSeconds(parseInt(x["timestamp"]));
            x["timestamp"] = d.getTime();
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
          this.ekgData.set(time.getTime(), m.get(x))
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
              // data: [3, 2.67, 3, 6.33, 3.33],
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

  generateData() {
    var now = new Date();
    this.min = 1000;
    // for (var i = 0; i < this.length; i++) {
    //   let y = this.addMoreData() * 10 + 70;
    //   this.data.push([now.getTime() - (this.length - i) * 3600, y]);
    //   this.min = Math.min(this.min, y);
    //   // labels.push(now.toISOString())
    // }
    // console.log(this.data)
    this.count = 0;
    for (var i = 0; i < this.length; i++) {
      let y = this.addMoreData2() * 10 + 50;
      this.data2.push([now.getTime() - (i) * 3600, y]);
      this.min = Math.min(this.min, y);
    }
    this.data2 = this.data2.reverse();
  }

  ngOnInit(): void {
    let ts = new Date();
    ts.setHours(ts.getHours() - 4);
    this.timestamp = ts.valueOf();
    // this.generateData();
    // var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // let offset = -5.0
    // now = new Date(utc + (3600000 * offset));
    console.log("t")
    let labels: string[] = []

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
            return time.getHours() + ":" + ((time.getMinutes() < 10) ? "0" + time.getMinutes() : time.getMinutes())
          }
        }
      },
      // yAxis: {
      //   min: this.min,
      // },
      title: {
        text: "Heart Rate V/s Time",
      },

    });

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


  logout() {
    this.router.navigateByUrl("signin");
  }
  gotoProfile() {
    this.router.navigateByUrl("view-profile");
  }

  gotoHome() {
    this.router.navigateByUrl("patient-home");
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  changeInterval(s) {
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

}
