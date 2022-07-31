import { TestBed } from '@angular/core/testing';

import { QuestionnairePatService } from './questionnaire-pat.service';

describe('QuestionnairePatService', () => {
  let service: QuestionnairePatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionnairePatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
