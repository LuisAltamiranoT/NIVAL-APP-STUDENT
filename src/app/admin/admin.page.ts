import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/service/auth.service';
import { ViewImagePage } from '../view-image/view-image.page';
import { DeleteMateriaPage } from './delete-materia/delete-materia.page';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  validate: boolean = false;
  width = 20;
  imgProfesor = 'https://material.angular.io/assets/img/examples/shiba1.jpg';

  // Carga la información de la base de datos acerca de las materias
  public materias = [];
  //controla el init view
  contInit:number= 0

  constructor(
    private authService: AuthService,
    private router: Router,
    public ventana: MatDialog
  ) { }


  ngOnInit() {
    if (this.contInit == 0) {
      //console.log('se ejecuta init');
      this.getMateriaEstudiante();
    }
  }
  
  ionViewWillEnter(){
    this.contInit = this.contInit + 1;
    if (this.contInit > 1) {
      //console.log('se ejecuta initView');
      this.getMateriaEstudiante();
    }
  }




  getMateriaEstudiante() {
    this.authService.getDataMateria().subscribe(data => {
      this.materias.length = 0;
      ////console.log('son los datos',data.length);
      //funcion ternaria
      this.validate = data.length != 0 ? true : false;

      data.forEach(element => {
        if (element.payload.doc.data()) {
          let idProfesor = element.payload.doc.data().idProfesor;
          let idMateria = element.payload.doc.data().uidMateria;
          let idCurso = element.payload.doc.data().idCurso;
          let IdMateriaEstudiante = element.payload.doc.id;

          this.authService.getMateriaId(idProfesor, idMateria).subscribe(dataMateria => {

            if (dataMateria.payload.data()) {
              let informacionCurso: any = dataMateria.payload.data();
              ////console.log('busca materias',informacionCurso,idCurso);

              let NombreMateria = informacionCurso.nombre;
              let NombreProfesor = informacionCurso.profesor;
              let PhotoProfesor: any = '';

              if (informacionCurso.photoUrl != '') {
                PhotoProfesor = informacionCurso.photoUrl
              }

              ////console.log('busqueda',dataMateria.payload.data())
              informacionCurso.cursos.forEach(element => {

                let imageCursoSeleccionado: any = '';
                if (element.image != '') {
                  imageCursoSeleccionado = element.image
                }

                if (element.id != idCurso) {
                } else {
                  this.materias.push({
                    aula: element.aula,
                    idProfesor: idProfesor,
                    materia: NombreMateria,
                    profesor: NombreProfesor,
                    photoCurso: imageCursoSeleccionado,
                    photoProfesor: PhotoProfesor,
                    idMateriaCurso: IdMateriaEstudiante
                  });
                }
              });
              ////console.log('materias',this.materias);

            }
          })
        }
      });
    })
  }

  openCurso(id: any) {
    this.router.navigate(['reporte', id]);
  }

  openEliminarCurso(id: any, materia: any, aula: any) {
    let data = {
      nombre: materia + ' - ' + aula,
      idMateria: id
    }
    this.openMaterial1(DeleteMateriaPage, data);
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

  openMaterial1(component: any, info: any) {
    this.ventana.open(component,
      { width: '25rem', data: info }).afterClosed().subscribe(item => {
      });
  }

}
