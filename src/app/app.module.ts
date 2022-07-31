import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from "./interceptor/httpconfig.interceptor";
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DoctorHomeComponent } from './components/doctor/doctor-home/doctor-home.component';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { QuestionaireComponent } from './components/questionaire/questionaire.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AngularEmojisModule } from 'angular-emojis';
import { HighchartsChartModule } from 'highcharts-angular';
import { DocPatientInfoComponent } from './doc-patient-info/doc-patient-info.component';
import { QuestionnairePatientComponent } from './questionnaire-patient/questionnaire-patient.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QuestionnairePatientModalComponent } from './questionnaire-patient-modal/questionnaire-patient-modal.component';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';

import { MatButton } from '@angular/material/button';
// import { QuestionnairePatientModalComponent } from './questionnaire-patient/questionnaire-patient.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    RegisterComponent,
    AdminHomeComponent,
    DoctorHomeComponent,
    ForgotPasswordComponent,
    PatientHomeComponent,
    ViewProfileComponent,
    EditProfileComponent,
    QuestionaireComponent,
    ReportsComponent,
    DocPatientInfoComponent,
    QuestionnairePatientComponent,
    QuestionnairePatientModalComponent,
  ],
  //entryComponents: [CustomEditorComponent, CustomRenderComponent],
  imports: [
    // CookieService,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastNotificationsModule,
    NgxSliderModule,
    AngularMaterialModule,
    FormsModule,
    MatSliderModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    Ng2SmartTableModule,
    AngularEmojisModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDialogModule,
    // ToastrModule.forRoot({
    //   timeOut: 2000,
    //   preventDuplicates: true,
    // }),
    // ToastrModule.forRoot(),
    LocalStorageModule.forRoot({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    FileUploadModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }