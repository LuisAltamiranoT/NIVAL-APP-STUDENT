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

  image = "../../../assets/icon/profe.jpg";
  perfil = "https://firebasestorage.googleapis.com/v0/b/easyacnival.appspot.com/o/imageCurso%2FwithoutUser.jpg?alt=media&token=61ba721c-b7c1-42eb-8712-829f4c465680";
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

  private suscripcion1: Subscription;
  private suscripcion3: Subscription;

  constructor(
    public ventana: MatDialog,
    private authService: AuthService,
    private router: Router,
    private _route: ActivatedRoute
  ) { }

  dato: any;
  ngOnInit(): void {
    this.dato = this._route.snapshot.paramMap.get('data');
    this.dataUser(this.dato);
  }

  ngOnDestroy() {
    this.suscripcion1.unsubscribe();
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
      this.perfil = dataUser[0].photoUrl;
    });
  }

}
