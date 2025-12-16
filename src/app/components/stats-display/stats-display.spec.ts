import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDisplay } from './stats-display';

describe('StatsDisplay', () => {
  let component: StatsDisplay;
  let fixture: ComponentFixture<StatsDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
