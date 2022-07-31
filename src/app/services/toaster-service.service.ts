import { Injectable } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';

@Injectable({
  providedIn: 'root'
})
export class ToasterServiceService {

  constructor(
    private toastr: Toaster
  ) { }

  toast(msg) {
    this.toastr.open({
      text: msg,
      type: "dark",
      duration: 3000,
      position: 'bottom-center'
    });
  }

  toast_danger(msg) {
    this.toastr.open({
      text: msg,
      type: "danger",
      duration: 5000,
      position: 'top-center'
    });
  }
}
