import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigoUnicoPage } from './codigo-unico.page';

const routes: Routes = [
  {
    path: '',
    component: CodigoUnicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigoUnicoPageRoutingModule {}
