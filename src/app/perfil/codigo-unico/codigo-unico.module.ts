import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoUnicoPageRoutingModule } from './codigo-unico-routing.module';

import { CodigoUnicoPage } from './codigo-unico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoUnicoPageRoutingModule
  ],
  declarations: [CodigoUnicoPage]
})
export class CodigoUnicoPageModule {}
