import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NombrePage } from './nombre/nombre.page';
import { ApellidoPage } from './apellido/apellido.page';
import { CodigoUnicoPage } from './codigo-unico/codigo-unico.page';
import { PasswordPage } from './password/password.page';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  image = "src/assets/profe.jpg";
  perfil = "../../assets/icon/perfil.jpg";
  nombre = "Prueba";
  apellido = "Preuab";
  codigoUnico = "";
  correo = "";
  password = "";

  val = true;
  private suscripcion1: Subscription;
  
  constructor(
    public ventana: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.dataUser();
  }

  ngOnDestroy() {
    this.suscripcion1.unsubscribe();
  }

  dataUser() {
    this.suscripcion1 = this.authService.getDataUser().subscribe((data) => {
      let dataUser: any = [data.payload.data()];
      this.nombre = dataUser[0].nombre;
      this.apellido = dataUser[0].apellido;
      this.image = dataUser[0].photoUrl;
      this.correo = dataUser[0].email;
      this.codigoUnico = dataUser[0].codigoUnico;
    });
  }

  openNombreModal() {
    this.openMaterial1(NombrePage, this.nombre);
  }

  openApellidoModal() {
    this.openMaterial1(ApellidoPage, this.apellido);
  }

  openCodigoUnicoModal(){
    this.openMaterial1(CodigoUnicoPage, this.codigoUnico);
  }

  openPasswordModal() {
    this.openMaterial1(PasswordPage, this.password);
  }


  openMaterial(component: any) {
    this.ventana.open(component,
      { width: ' 25rem' }).afterClosed().subscribe(item => {
        //this.ListaDepartamentos();
        // Aqui va algo que quieras hacer al cerrar el componente
        // yo se poner la actualizacion de la pagina jejjeje
      });
  }

  openMaterial1(component: any, info: any) {
    this.ventana.open(component,
      { width: ' 25rem', data: info }).afterClosed().subscribe(item => {
      });
  }
}
