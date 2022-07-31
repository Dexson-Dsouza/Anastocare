import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnairePatientComponent } from './questionnaire-patient.component';

describe('QuestionnairePatientComponent', () => {
  let component: QuestionnairePatientComponent;
  let fixture: ComponentFixture<QuestionnairePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnairePatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnairePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
