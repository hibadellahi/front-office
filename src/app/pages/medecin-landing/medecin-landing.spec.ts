import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinLanding } from './medecin-landing';

describe('MedecinLanding', () => {
  let component: MedecinLanding;
  let fixture: ComponentFixture<MedecinLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinLanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
