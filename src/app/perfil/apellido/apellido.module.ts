import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApellidoPageRoutingModule } from './apellido-routing.module';

import { ApellidoPage } from './apellido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApellidoPageRoutingModule
  ],
  declarations: [ApellidoPage]
})
export class ApellidoPageModule {}
