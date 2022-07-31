import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnairePatientModalComponent } from './questionnaire-patient-modal.component';

describe('QuestionnairePatientModalComponent', () => {
  let component: QuestionnairePatientModalComponent;
  let fixture: ComponentFixture<QuestionnairePatientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnairePatientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnairePatientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
