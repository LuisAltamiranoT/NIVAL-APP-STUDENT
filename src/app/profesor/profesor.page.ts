import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit {

  img = "../../assets/icon/withoutUser.jpg";
  perfil = "";
  nombre = "";
  apellido = "";
  oficina = "";
  correo = "";
  informacion = "";
  cursos = [];
  materias = [];
  cursoCompleto = [];
  password = "";
  materiaSeleccionada = "";
  nombreMateria = "";

  AnioLectivoInicio = "dd/mm/yyyy";
  AnioLectivoFin = "dd/mm/yyyy";

  val = true;
  ///controla e init
  contInit:number=0;

  private suscripcion1: Subscription;

  constructor(
    public ventana: MatDialog,
    private authService: AuthService,
    private _route: ActivatedRoute
  ) { }

  dato: any;
  ngOnInit(){
    if (this.contInit == 0) {
      this.dato = this._route.snapshot.paramMap.get('data');
      this.dataUser(this.dato);
    }
  }


  ionViewWillEnter(){
    this.contInit = this.contInit + 1;
    if (this.contInit > 1) {
      this.dato = this._route.snapshot.paramMap.get('data');
      this.dataUser(this.dato);
    }
  }



  ionViewDidLeave() {
    if (this.suscripcion1) {
      this.suscripcion1.unsubscribe();
      //console.log('se cancela la suscripcion 1');
    }
  }
  dataUser(dato) {
    this.suscripcion1 = this.authService.getDataProfesor(dato).subscribe((data) => {
      let dataUser: any = [data.payload.data()];
      this.nombre = dataUser[0].nombre;
      this.apellido = dataUser[0].apellido;
      this.correo = dataUser[0].email;
      this.informacion = dataUser[0].info;
      this.oficina = dataUser[0].oficina;
      this.AnioLectivoInicio = dataUser[0].anioInicio;
      this.AnioLectivoFin = dataUser[0].anioFin;
      if(dataUser[0].photoUrl!=''){
        this.perfil = dataUser[0].photoUrl;
      }
    });
  }

}
