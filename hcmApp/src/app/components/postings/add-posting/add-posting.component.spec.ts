import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostingComponent } from './add-posting.component';

describe('AddPostingComponent', () => {
  let component: AddPostingComponent;
  let fixture: ComponentFixture<AddPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPostingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
