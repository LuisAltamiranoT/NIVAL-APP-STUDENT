
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/service/auth.service';
import { ViewImagePage } from '../view-image/view-image.page';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  validate: boolean = true;
  width = 20;
  imgProfesor = 'https://material.angular.io/assets/img/examples/shiba1.jpg';

  //informacion de los cursos guardados en el sistema
  public cursoVista = [];
  //carga la informacion de la base de datos acerca de las materias
  public materias = [];
  //caraga la informacion del curso
  public curso = [];
  //carga horario guardado
  public cursosGuardados = [];
  //controla imagen de fondo
  public stateImage: boolean = false;
  //colores para cada materia
  private color = ['DARKSLATEGRAY', 'CADETBLUE', 'CORAL', 'FIREBRICK', 'TEAL', 'INDIANRED', 'DARKSLATEBLUE', 'SEAGREEN', 'BROWN', 'LIGHTSLATEGRAY'];

  //control de suscripciones
  private suscripcion1: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    public ventana: MatDialog
  ) { }

  ngOnInit() {
    this.getMateria();
  }

  click() {
    console.log('vale');
  }

  getMateria() {
    this.suscripcion1 = this.authService.getDataMateria().subscribe((data) => {
      this.materias.length = 0;
      console.log('datos', data)
      data.forEach((dataMateria: any) => {
        this.materias.push({
          id: dataMateria.payload.doc.id,
          data: dataMateria.payload.doc.data()
        });
        console.log('datos_vista', this.materias)
      })
      this.materias.forEach((element: any) => {
        if (element.data.photoCurso === '') {
          element.data.photoCurso = '../../../assets/icon/clase.jpg';
        }
        if (element.data.photoProfesor === '') {
          element.data.photoProfesor = 'https://firebasestorage.googleapis.com/v0/b/easyacnival.appspot.com/o/imageCurso%2FwithoutUser.jpg?alt=media&token=61ba721c-b7c1-42eb-8712-829f4c465680';
        }
      })
    });
  }

  openPhoto(image: any) {
    if (image != '') {
      this.ventana.open(ViewImagePage,
        { data: image }).afterClosed().subscribe(item => {
        });
    } else {
      this.authService.showInfo('El curso no dispone de una imagen');
    }
  }

}
