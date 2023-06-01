import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePostingsComponent } from './manage-postings.component';

describe('ManagePostingsComponent', () => {
  let component: ManagePostingsComponent;
  let fixture: ComponentFixture<ManagePostingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePostingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
