import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NombrePage } from './nombre/nombre.page';
import { ApellidoPage } from './apellido/apellido.page';
import { CodigoUnicoPage } from './codigo-unico/codigo-unico.page';
import { PasswordPage } from './password/password.page';
import { FotoPage } from './foto/foto.page';
import { DeletePage } from './delete/delete.page';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  img = "../../assets/icon/withoutUser.jpg";
  perfil = '';
  nombre = "Prueba";
  apellido = "Preuab";
  codigoUnico = "";
  correo = "";
  password = "";
  //comprobar fucnionamiento del init
  contInit:number = 0;


  val = true;
  private suscripcion1: Subscription;
  
  constructor(
    public ventana: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.contInit == 0) {
      //console.log('se ejecuta init');
      this.dataUser();
    }
  }
  ionViewWillEnter(){
    this.contInit = this.contInit + 1;
    if (this.contInit > 1) {
      //console.log('se ejecuta initview');
      this.dataUser();
    }
  }

  ionViewDidLeave() {
    if (this.suscripcion1) {
      this.suscripcion1.unsubscribe();
      //console.log('se cancela la suscripcion 1');
    }
  }

  dataUser() {
    this.suscripcion1 = this.authService.getDataUser().subscribe((data) => {
      let dataUser: any = [data.payload.data()];
      this.nombre = dataUser[0].nombre;
      this.apellido = dataUser[0].apellido;
      if(dataUser[0].photoUrl!=''){
        this.perfil = dataUser[0].photoUrl;
      }
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

  openDeleteModal() {
    this.openMaterial1(DeletePage,this.perfil);
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

  openPhoto() {
    if (this.perfil != '') {
      this.ventana.open(FotoPage,
        { width: ' 25rem', data: this.perfil }).afterClosed().subscribe(item => {
        });
    } else {
      this.ventana.open(FotoPage,
        { width: ' 25rem', data: 'no-image' }).afterClosed().subscribe(item => {
        });
    }
  }
}
