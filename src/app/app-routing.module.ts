import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { DoctorHomeComponent } from './components/doctor/doctor-home/doctor-home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { QuestionaireComponent } from './components/questionaire/questionaire.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DocPatientInfoComponent } from './doc-patient-info/doc-patient-info.component';
import { QuestionnairePatientComponent } from './questionnaire-patient/questionnaire-patient.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'signin' },
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 'doctor-home', component: DoctorHomeComponent },
  { path: 'doc-patient-info', component: DocPatientInfoComponent },
  { path: 'set-password/:token/:email', component: ForgotPasswordComponent },
  { path: 'set-password/:token', component: ForgotPasswordComponent },
  { path: 'set-password', component: ForgotPasswordComponent },
  { path: 'patient-home', component: PatientHomeComponent },
  { path: 'view-profile', component: ViewProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'questionnaire', component: QuestionaireComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'questionnaire-patient', component: QuestionnairePatientComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }