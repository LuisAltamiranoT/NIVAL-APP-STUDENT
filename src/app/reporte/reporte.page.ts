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
          filas = filas + 1;
          let cont = 0;
          let porcentaje = 0;

          if (dataMateria.correo != correo) {

          } else {
            this.ejemplo.push({
              Fila:'Numero',
              Detalle: ''+filas
            })
            dataMateria.asistencia.forEach(element => {
              cont = cont + 1;
              if (element.presente === true) {
                obj['Fila']=cont + ') ' + element.fecha + ' ' + element.dia;
                obj['Detalle'] = 'Presente';
                porcentaje = porcentaje + 1;
              }
              if (element.atraso === true) {
                obj['Fila']=cont + ') ' + element.fecha + ' ' + element.dia;
                obj['Detalle'] = 'Atraso';
                porcentaje = porcentaje + 0.5;
              }
              if (element.falta === true) {
                obj['Fila']=cont + ') ' + element.fecha + ' ' + element.dia;
                obj['Detalle'] = 'Falta';
              }
              this.ejemplo.push(obj);
              obj = {};

            });
            
            this.ejemplo.push({
              Fila:'Porcentaje',
              Detalle: ((porcentaje / cont) * 100).toFixed(0) + '%'
            })
            
          }

        });
        for (let v in this.ejemplo[0]) {
          this.displayedColumns.push(v);
        }
        this.dataSource = new MatTableDataSource(this.ejemplo.sort());
      })
    });
  }

  getColor(data: any) {
    switch (data) {
      case 'Presente':
        return '#3f51b5';
      case 'Atraso':
        return '#E2B657';
      case 'Falta':
        return '#D94949';
      default:
        return '#808B96';
    }
  }

}
