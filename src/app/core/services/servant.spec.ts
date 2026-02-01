import { TestBed } from '@angular/core/testing';

import { Servant } from './servant';

describe('Servant', () => {
  let service: Servant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Servant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
