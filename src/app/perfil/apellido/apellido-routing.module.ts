import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApellidoPage } from './apellido.page';

const routes: Routes = [
  {
    path: '',
    component: ApellidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApellidoPageRoutingModule {}
