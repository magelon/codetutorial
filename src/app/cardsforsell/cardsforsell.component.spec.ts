import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsforsellComponent } from './cardsforsell.component';

describe('CardsforsellComponent', () => {
  let component: CardsforsellComponent;
  let fixture: ComponentFixture<CardsforsellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsforsellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsforsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
