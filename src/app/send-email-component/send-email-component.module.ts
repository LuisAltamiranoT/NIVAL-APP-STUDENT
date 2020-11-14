import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendEmailComponentPageRoutingModule } from './send-email-component-routing.module';

import { SendEmailComponentPage } from './send-email-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendEmailComponentPageRoutingModule
  ],
  declarations: [SendEmailComponentPage]
})
export class SendEmailComponentPageModule {}
