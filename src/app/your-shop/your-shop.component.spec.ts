import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourShopComponent } from './your-shop.component';

describe('YourShopComponent', () => {
  let component: YourShopComponent;
  let fixture: ComponentFixture<YourShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
