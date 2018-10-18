import { TestBed } from '@angular/core/testing';

import { ElementHelperService } from './element-helper.service';

describe('ElementHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElementHelperService = TestBed.get(ElementHelperService);
    expect(service).toBeTruthy();
  });
});
