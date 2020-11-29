import { Component, OnInit } from '@angular/core';
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
    { hora: '7:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '7:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '8:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '8:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '9:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '9:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '10:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '10:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '11:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '11:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '12:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '12:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '13:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '13:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '14:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '14:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '15:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '15:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '16:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '16:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '17:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '17:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '18:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    //{ hora: '18:30', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '19:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''},
    { hora: '20:00', lunes: '',LC:'',Lid:'', martes: '',MC:'',Mid:'',miercoles: '', MiC:'',Miid:'', jueves: '',JC:'',Jid:'', viernes: '',VC:'',Vid:''}
  ]

  //carga la informacion de la base de datos
public materias = [];
//caraga la informacion del curso
public curso = [];
//carga horario guardado
public horarioGuardado = [];
//colores para cada materia
private color=['DARKSLATEGRAY','CADETBLUE','CORAL','FIREBRICK','TEAL','INDIANRED','DARKSLATEBLUE','SEAGREEN','BROWN','LIGHTSLATEGRAY'];

  constructor(
    public router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

}
