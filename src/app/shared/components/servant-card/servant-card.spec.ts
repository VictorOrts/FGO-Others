import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServantCard } from './servant-card';

describe('ServantCard', () => {
  let component: ServantCard;
  let fixture: ComponentFixture<ServantCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServantCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServantCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
