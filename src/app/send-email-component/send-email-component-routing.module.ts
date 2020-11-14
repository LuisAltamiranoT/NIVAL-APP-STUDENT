import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendEmailComponentPage } from './send-email-component.page';

const routes: Routes = [
  {
    path: '',
    component: SendEmailComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendEmailComponentPageRoutingModule {}
