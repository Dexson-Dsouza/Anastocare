import { TestBed } from '@angular/core/testing';

import { DocPatientInfoServiceService } from './doc-patient-info-service.service';

describe('DocPatientInfoServiceService', () => {
  let service: DocPatientInfoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocPatientInfoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
