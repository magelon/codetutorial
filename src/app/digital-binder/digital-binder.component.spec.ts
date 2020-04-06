import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalBinderComponent } from './digital-binder.component';

describe('DigitalBinderComponent', () => {
  let component: DigitalBinderComponent;
  let fixture: ComponentFixture<DigitalBinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalBinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalBinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
