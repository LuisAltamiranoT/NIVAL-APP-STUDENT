import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';




@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {
  //control de suscripciones
  private suscripcion1: Subscription;
  private suscripcion2: Subscription;
  //validacion de botones
  ValidateButton = false;

  //manejor de tablas 
  @ViewChild(MatTable) tabla1: MatTable<any>;

  displayedColumns: string[] = [];
  //carga la inforamcion que se presentara en la vista
  ejemplo: any[] = [];
  //la inforamcion que se va imprimir
  dataSource;

  //obtiene el id pasado desdde el otra ventana
  dataId;

  constructor(
    private authService: AuthService,
    public router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    //id Materia estudiante
    this.dataId = this._route.snapshot.paramMap.get('data');
    this.cargar();
  }

  cargar() {
    let obj = {};
    this.authService.getDataMateriaId(this.dataId).subscribe((data) => {
      console.log(data.payload.data());
      let materia: any = data.payload.data();
      let idProfesor = materia.idProfesor;
      let idMateria = materia.uidMateria;
      let idNomina = materia.uidNomina;
      let correo = materia.correo;
      this.authService.getDataNominaCursoId(idProfesor, idMateria, idNomina).subscribe(dataNomina => {
        let dataNominaCurso: any = dataNomina.payload.data();
        let filas = 0;
        this.ejemplo.length = 0;
        this.displayedColumns.length = 0;
        dataNominaCurso.nomina.forEach((dataMateria: any) => {
          console.log('foreach nomina', dataMateria)
          filas = filas + 1;
          let cont = 0;
          let porcentaje = 0;

          if (dataMateria.correo != correo) {

          } else {
            obj = {
              Numero: filas
            }
            dataMateria.asistencia.forEach(element => {
              cont = cont + 1;

              if (element.presente === true) {
                obj[cont + ') ' + element.fecha + ' ' + element.dia] = 'Presente';
                porcentaje = porcentaje + 1;
              }
              if (element.atraso === true) {
                obj[cont + ') ' + element.fecha + ' ' + element.dia] = 'Atraso';
                porcentaje = porcentaje + 0.5;
              }
              if (element.falta === true) {
                obj[cont + ') ' + element.fecha + ' ' + element.dia] = 'Falta';
              }

            });
            obj['Porcentaje'] = ((porcentaje / cont) * 100).toFixed(0) + '%';
            this.ejemplo.push(obj);
            obj = {};
          }

        });
        for (let v in this.ejemplo[0]) {
          this.displayedColumns.push(v);
        }
        this.dataSource = new MatTableDataSource(this.ejemplo.sort());
      })
      console.log('informacion', materia);
    });
  }

  getColor(data: any) {
    ////console.log(data);
    switch (data) {
      case 'Presente':
        return '#21618C';
      case 'Atraso':
        return '#BA4A00 ';
      case 'Falta':
        return '#2E4053';
    }
  }

}
