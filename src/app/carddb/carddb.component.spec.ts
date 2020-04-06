import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarddbComponent } from './carddb.component';

describe('CarddbComponent', () => {
  let component: CarddbComponent;
  let fixture: ComponentFixture<CarddbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarddbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarddbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
