import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CodigoUnicoPage } from './codigo-unico.page';

describe('CodigoUnicoPage', () => {
  let component: CodigoUnicoPage;
  let fixture: ComponentFixture<CodigoUnicoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigoUnicoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodigoUnicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
