import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

import { IonicModule } from '@ionic/angular';

import { SendEmailComponentPageRoutingModule } from './send-email-component-routing.module';

import { SendEmailComponentPage } from './send-email-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendEmailComponentPageRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [SendEmailComponentPage]
})
export class SendEmailComponentPageModule {}
