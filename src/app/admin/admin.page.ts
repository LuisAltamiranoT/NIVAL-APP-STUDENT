import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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

  // Información de los cursos guardados en el sistema
  public cursoVista = [];
  // Carga la información de la base de datos acerca de las materias
  public materias = [];
  //caraga la informacion del curso
  public curso = [];
  //colores para cada materia
  private color = ['DARKSLATEGRAY', 'CADETBLUE', 'CORAL', 'FIREBRICK', 'TEAL', 'INDIANRED', 'DARKSLATEBLUE', 'SEAGREEN', 'BROWN', 'LIGHTSLATEGRAY'];


  constructor(
    private authService: AuthService,
    private router: Router,
    public ventana: MatDialog
  ) { }

  ngOnInit() {
    this.getMateriaEstudiante();
  }

 
  click() {
    console.log('vale');
  }

  getMateriaEstudiante() {
    this.authService.getDataMateria().subscribe(data => {
      data.forEach(element => {
        let idProfesor = element.payload.doc.data().idProfesor;
        let idMateria = element.payload.doc.data().uidMateria;
        let idCurso = element.payload.doc.data().idCurso;
        this.authService.getMateriaId(idProfesor, idMateria).subscribe(dataMateria => {
          let informacionCurso:any=dataMateria.payload.data();
          let NombreMateria=informacionCurso.nombre;
          let NombreProfesor=informacionCurso.profesor;
          let PhotoProfesor:any='';

          if (informacionCurso.photoUrl === '') {
            PhotoProfesor = 'https://firebasestorage.googleapis.com/v0/b/easyacnival.appspot.com/o/imageCurso%2FwithoutUser.jpg?alt=media&token=61ba721c-b7c1-42eb-8712-829f4c465680';
          }else{
            PhotoProfesor=informacionCurso.photoUrl
          }

          
          console.log('busqueda',dataMateria.payload.data())
          informacionCurso.cursos.forEach(element => {

            let imageCursoSeleccionado:any='';
            if (element.image === '') {
              imageCursoSeleccionado = '../../../assets/icon/clase.jpg';
            }else{
              imageCursoSeleccionado = element.image
            }

            if(element.id!=idCurso){
            }else{
              this.materias.push({
                aula:element.aula,
                idProfesor:idProfesor,
                materia:NombreMateria,
                profesor:NombreProfesor,
                photoCurso:imageCursoSeleccionado,
                photoProfesor:PhotoProfesor
              });
            }
          });
          console.log(this.materias);
        })
      });
    })
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
