import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierList } from './tier-list';

describe('TierList', () => {
  let component: TierList;
  let fixture: ComponentFixture<TierList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TierList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TierList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
