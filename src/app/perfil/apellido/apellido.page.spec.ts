import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApellidoPage } from './apellido.page';

describe('ApellidoPage', () => {
  let component: ApellidoPage;
  let fixture: ComponentFixture<ApellidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApellidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApellidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
