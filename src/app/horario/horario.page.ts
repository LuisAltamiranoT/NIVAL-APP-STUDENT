import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Horario } from "src/app/shared/horario.interface";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.page.html',
  styleUrls: ['./horario.page.scss'],
})
export class HorarioPage implements OnInit {


  public horarioVista: Horario[] = [
    { hora: '7:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '7:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '8:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '8:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '9:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '9:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '10:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '10:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '11:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '11:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '12:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '12:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '13:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '13:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '14:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '14:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '15:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '15:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '16:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '16:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '17:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '17:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '18:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    //{ hora: '18:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '19:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' },
    { hora: '20:00', lunes: '', LC: '', Lid: '', martes: '', MC: '', Mid: '', miercoles: '', MiC: '', Miid: '', jueves: '', JC: '', Jid: '', viernes: '', VC: '', Vid: '' }
  ]

  //carga la informacion de la base de datos
  public materias: any[] = [];
  //caraga la informacion del curso
  public curso = [];
  //carga horario guardado
  public horarioGuardado = [];
  //colores para cada materia
  private color = ['CORAL','DARKSLATEGRAY', 'CADETBLUE', 'FIREBRICK', 'TEAL', 'INDIANRED', 'DARKSLATEBLUE', 'SEAGREEN', 'BROWN', 'LIGHTSLATEGRAY'];
  //contador init
  contInit:number=0
  //cont de colores
  cont:number = -1;

  constructor(
    public router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.contInit == 0) {
      //console.log('se ejecuta init',this.cont);
      this.getMateriaEstudiante();
    }
  }
  
  ionViewWillEnter(){
    this.contInit = this.contInit + 1;
    if (this.contInit > 1) {
      //console.log('se ejecuta initView',this.cont);
      this.getMateriaEstudiante();
    }
  }


  

  displayedColumns: string[] = ['hora', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  dataSource = new MatTableDataSource(this.horarioVista);


  getMateriaEstudiante() {
    let validate = false;
    this.authService.getDataMateria().subscribe((data: any) => {
      this.materias.length=0;
      ////console.log('se ejecuta authservice', data);
      data.forEach(element => {
        if (element.payload.doc.data()) {
          let idProfesor = element.payload.doc.data().idProfesor;
          let idMateria = element.payload.doc.data().uidMateria;
          let idCurso = element.payload.doc.data().idCurso;
          let IdMateriaEstudiante = element.payload.doc.id;

          this.authService.getMateriaId(idProfesor, idMateria).subscribe((dataMateria: any) => {
            validate = false;
            if (dataMateria.payload.data()) {
              ////console.log('existe');
              ////console.log('es el auth service consulta',dataMateria.payload.data());
              let nombreMateria = dataMateria.payload.data().nombre;
              ////console.log('informacion buscaa', dataMateria.payload.data().nombre);
              dataMateria.payload.data().cursos.forEach(elementCursos => {
                ////console.log('esta validando si es',elementCursos.id, idCurso)
                if (elementCursos.id != idCurso) {
                  ////console.log('no llega a ejecutarse');
                } else {
                  validate = true
                  //console.log('llega a ejecutarse');
                  ////console.log(elementCursos)
                  this.materias.push({
                    data: elementCursos,
                    nombre: nombreMateria,
                    id: IdMateriaEstudiante
                  });
                  ////console.log(this.materias);
                }
              });

              if (validate) {
              } else {
                ////console.log('no existe el cusro');
                this.authService.delecteMateria(IdMateriaEstudiante);
              }
              ////console.log(this.materias);
              this.replaceHorario();
            } else {
              ////console.log('no existe materia');
              this.authService.delecteMateria(IdMateriaEstudiante);
            }

          })

        }
      });
    })
  }


  replaceHorario() {
    this.cont=-1;
    ////console.log('no esta llegando');
    //console.log(this.materias.length)
    if (this.materias.length != 0) {
      this.materias.forEach(element => {
        ////console.log('datos a imprimir', element.data)
        if (this.cont < this.color.length - 1) {
          this.cont = this.cont + 1
        } else {
          this.cont = 0;
        }
        element.data.horario.forEach(elementHorario => {
          ////console.log('este es el horario', elementHorario)
          let idCurso = element.id;
          ////console.log('uid nomina',elementCurso.uidNomina);
          this.horarioVista[elementHorario.posicion][elementHorario.dia] = element.nombre + ' - ' + element.data.aula;
          if (elementHorario.dia === 'lunes') {
            this.horarioVista[elementHorario.posicion]['LC'] = this.color[this.cont];
            this.horarioVista[elementHorario.posicion]['Lid'] = idCurso;
          }
          if (elementHorario.dia === 'martes') {
            this.horarioVista[elementHorario.posicion]['MC'] = this.color[this.cont];
            this.horarioVista[elementHorario.posicion]['Mid'] = idCurso;
          }
          if (elementHorario.dia === 'miercoles') {
            this.horarioVista[elementHorario.posicion]['MiC'] = this.color[this.cont];
            this.horarioVista[elementHorario.posicion]['Miid'] = idCurso;
          }
          if (elementHorario.dia === 'jueves') {
            this.horarioVista[elementHorario.posicion]['JC'] = this.color[this.cont];
            this.horarioVista[elementHorario.posicion]['Jid'] = idCurso;
          }
          if (elementHorario.dia === 'viernes') {
            this.horarioVista[elementHorario.posicion]['VC'] = this.color[this.cont];
            this.horarioVista[elementHorario.posicion]['Vid'] = idCurso;
          }
        });
      });
    } 
    ////console.log(this.horarioVista);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openCurso(id: any) {
    //this.router.navigate(['vista-curso', id]);
    this.router.navigate(['reporte', id]);
  }

  limpiarBusqueda(input) {
    input.value = '';
    this.dataSource.filter = null;
  }




}
