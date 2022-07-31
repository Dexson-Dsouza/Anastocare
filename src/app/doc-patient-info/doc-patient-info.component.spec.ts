import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPatientInfoComponent } from './doc-patient-info.component';

describe('DocPatientInfoComponent', () => {
  let component: DocPatientInfoComponent;
  let fixture: ComponentFixture<DocPatientInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocPatientInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocPatientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
