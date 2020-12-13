import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteMateriaPage } from './delete-materia.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteMateriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteMateriaPageRoutingModule {}
