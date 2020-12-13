import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  },
  {
    path: 'apellido',
    loadChildren: () => import('./apellido/apellido.module').then( m => m.ApellidoPageModule)
  },
  {
    path: 'nombre',
    loadChildren: () => import('./nombre/nombre.module').then( m => m.NombrePageModule)
  },
  {
    path: 'codigo-unico',
    loadChildren: () => import('./codigo-unico/codigo-unico.module').then( m => m.CodigoUnicoPageModule)
  },
  {
    path: 'foto',
    loadChildren: () => import('./foto/foto.module').then( m => m.FotoPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'delete',
    loadChildren: () => import('./delete/delete.module').then( m => m.DeletePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
