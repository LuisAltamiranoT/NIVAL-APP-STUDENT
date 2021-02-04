import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { LoginGuard } from './shared/login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[LoginGuard]
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'login_',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'register_',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'send-email-component',
    loadChildren: () => import('./send-email-component/send-email-component.module').then( m => m.SendEmailComponentPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'horario',
    loadChildren: () => import('./horario/horario.module').then( m => m.HorarioPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'scanner',
    loadChildren: () => import('./scanner/scanner.module').then( m => m.ScannerPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'profesor/:data',
    loadChildren: () => import('./profesor/profesor.module').then( m => m.ProfesorPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'view-image',
    loadChildren: () => import('./view-image/view-image.module').then( m => m.ViewImagePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'reporte/:data',
    loadChildren: () => import('./reporte/reporte.module').then( m => m.ReportePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'admin',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
