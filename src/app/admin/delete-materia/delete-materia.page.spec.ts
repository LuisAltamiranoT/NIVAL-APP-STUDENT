import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeleteMateriaPage } from './delete-materia.page';

describe('DeleteMateriaPage', () => {
  let component: DeleteMateriaPage;
  let fixture: ComponentFixture<DeleteMateriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMateriaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteMateriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
