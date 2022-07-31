import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnairePatData } from '../questionnaire-patient/questionnaire-patient.component'


@Injectable({
  providedIn: 'root'
})
export class DocPatientInfoServiceService {
  patientData: any = {
    email: "peter@mail.com",
    name: "Pete James",
    patientCondition: "Bad",
    riskFactor: undefined,
    status: "Enabled",
    userId: 58,
  };
  patEmail: any;
  patName: any;
  timestampLinked: number;
  docMail: string;
  patQuestionnaireList: QuestionnairePatData[];

  // this.patientData = this.userservice.dataRow;

  constructor(private http: HttpClient) { }

  public getQuestionnairePatByEmail(email, headers) {
    return this.http.get(environment.url + "api/v1/questionnaire/getlatest/" + email, { 'headers': headers });
  }

}
