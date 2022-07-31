import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { PatientRiskInterface } from '../components/doctor/doctor-home/doctor-home.component';
import * as patientRisk from '../_files/patientRisk.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // patientRiskList: PatientRiskInterface[] = patientRisk;
  constructor(private http: HttpClient) { }

  public loginAdminFromPortal(user): Observable<any> {
    return this.http.post(environment.url + "api/v1/", user)
  }

  public loginUser(user) {
    return this.http.post(environment.url + "login", user, {});
  }

  public getDetails(email) {
    return this.http.get(environment.url + "api/v1/" + email);
  }
  public getUserList(headers) {
    return this.http.get(environment.url + "api/v1/admin", { 'headers': headers });
  }

  public getOrganizations(headers) {
    return this.http.get(environment.url + "api/v1/org/get");
  }

  public addEditOrganization(body, headers) {
    return this.http.post(environment.url + "api/v1/org/add", body, { responseType: 'text' });
  }
  public addEditAdmin(body) {
    return this.http.post(environment.url + "api/v1/registration/localadmin", body, { responseType: 'text' });
  }

  public getQuestionaire(headers) {
    return this.http.get(environment.url + "api/v1/questionnaire/get", { 'headers': headers });
  }

  public getRiskFactor(email, headers) {
    return this.http.get(environment.url + "api/v1/riskfactor/" + email, { 'headers': headers });
    // return patientRisk;
  }
  public addEditQeustion(body) {
    return this.http.post(environment.url + "api/v1/questionnaire/set", body, { responseType: 'text' });
  }

  public delOrganization(body) {
    return this.http.post(environment.url + "api/v1/org/rem", body, { responseType: 'text' });
  }
  public delUser(body) {
    return this.http.post(environment.url + "api/v1/del/" + body.email, body, { responseType: 'text' });
  }
  public delQuestion(body) {
    return this.http.post(environment.url + "api/v1/questionnaire/del", body, { responseType: 'text' });
  }
  public addDoctor(body) {
    return this.http.post(environment.url + "api/v1/registration/doctor", body, { responseType: 'text' });
  }

  public resetPass(body) {
    return this.http.post(environment.url + "api/v1/resetpassword", body, { responseType: 'text' });
  }
  public getDocPatient(email, headers) {
    return this.http.get(environment.url + "api/v1/doctor/" + email, { 'headers': headers });
  }
  
  public getDocInactivePatients(email, headers) {
    return this.http.get(environment.url + "api/v1/doctor/inactive-patients/" + email, { 'headers': headers });
  }

  public sendActivationLink(body) {
    return this.http.get(environment.url + "api/v1/sendmail/", { responseType: 'text', params: body });
  }

  public sendAlertMail(body) {

    return this.http.post(environment.url + "api/v1/sendmail/alert", body, { responseType: 'text' });
  }

  public confirmToken(body) {
    return this.http.get(environment.url + "api/v1/registration/confirm", { responseType: 'text', params: body });
  }

  public setPassword(body) {
    return this.http.post(environment.url + "api/v1/resetpassword", body, { responseType: 'text' });
  }

  public mapDocAndPatient(body) {
    return this.http.post(environment.url + "api/v1/doctor/mapPatient", body, { responseType: 'text' });
  }

  public addGlobalAdmin(body) {
    return this.http.post(environment.url + "api/v1/registration/admin", body, { responseType: 'text' });
  }


  public getThreshold() {
    return this.http.get(environment.url + "api/v1/questionnaire/getThreshold", { responseType: 'text' });
  }

  public setThreshold(body) {
    return this.http.post(environment.url + "api/v1/questionnaire/setThreshold", body, { responseType: 'text' });
  }
  public setRiskFactor(body, pEmail) {

    return this.http.post(environment.url + "api/v1/riskfactor/" + pEmail, body, { responseType: 'text', params: body });
  }

  public setUserOrg(body) {
    return this.http.post(environment.url + "api/v1/set/org", body, { responseType: 'text' });
  }

  public getDoctors() {
    return this.http.get(environment.url + "api/v1/get/doctors");
  }

  public saveAnswers(body) {
    return this.http.post(environment.url + "api/v1/questionnaire/map", body, { responseType: 'text' });
  }

  public updateProfile(body) {
    return this.http.post(environment.url + "api/v1/edit/" + body.email, body, { responseType: 'text' });
  }

  public upload(email, body) {
    return this.http.post(environment.url + "api/v1/image/" + email, body, { responseType: 'text' });
  }

  public getProfilePic(email) {
    return this.http.get(environment.url + "api/v1/image/" + email);
  }

  public getDoctorInfo(email) {
    return this.http.get(environment.url + "api/v1/doctor/ofpatient/" + email);
  }

  public getlatestQuestionaire(email) {
    return this.http.get(environment.url + "api/v1/questionnaire/getlatest/" + email);
  }

  public getHealthInfo(email) {
    return this.http.get(environment.url + "api/v1/get/patientDetails/" + email);
  }

  public getHealthInfoEkg(email) {
    return this.http.post(environment.url + "api/v1/get/ekg",{ email: email });
  }


}
