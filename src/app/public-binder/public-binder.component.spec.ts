import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBinderComponent } from './public-binder.component';

describe('PublicBinderComponent', () => {
  let component: PublicBinderComponent;
  let fixture: ComponentFixture<PublicBinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicBinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
