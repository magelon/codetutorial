import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickacardComponent } from './pickacard.component';

describe('PickacardComponent', () => {
  let component: PickacardComponent;
  let fixture: ComponentFixture<PickacardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickacardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickacardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
