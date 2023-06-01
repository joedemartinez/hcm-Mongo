import { TestBed } from '@angular/core/testing';

import { ManageAuthGuard } from './manage-auth.guard';

describe('ManageAuthGuard', () => {
  let guard: ManageAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManageAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
