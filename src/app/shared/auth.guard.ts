import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  role: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user$.pipe(
        take(1),
        map((user)=> user && this.authService.isAdmin(user)),
        tap(canEdit => {
          if(canEdit){
           return true;
          }else{
            this.authService.logout();
            this.authService.showError('Acceso denegado. No tiene permisos para usar el sistema');
            this.router.navigate(['/home']);
            return false;
          }
        })
      );
  }

}
