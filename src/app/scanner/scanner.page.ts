import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import * as CryptoJS from 'crypto-js'
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit, AfterViewInit,OnDestroy {
  image = "src/assets/profe.jpg";
  perfil = "https://firebasestorage.googleapis.com/v0/b/easyacnival.appspot.com/o/imageCurso%2FwithoutUser.jpg?alt=media&token=61ba721c-b7c1-42eb-8712-829f4c465680";
  nombre = "";
  apellido = "";
  codigoUnico = "";
  correo = "";
  password = "";
  uidEstudiante: any = '';
  //datos a almacenar 
  datosAlmacenar: any = '';

  splitted: any[] = [];
  materiasEstudiante: any[] = [];

  idProfesor: any = '';
  idMateria: any = '';
  idCurso: any = '';
  idNomina: any = '';
  codigoQr: any = '';
  //informacion de la materia y aula
  nombreMateria: any = null;
  aulaSeleccionada: any = null;

  //comprueba si la materia existe
  validacionMateria: any = false;
  //comprueba si el curso existe
  validacionCurso: any = false;
  //comprueba si la noina existe
  validacionNomina: any = false;
  //valida si consta en la lista
  validacionGuardado: any = false;
  //valida el inicio y fin de proceso
  validacionBar: any = false;

  //timer controler
  timeLeft: number = 3;
  interval: any;
  subscribeTimer: any;

   //comprobar fucnionamiento del init
   contInit:number = 0;



  private suscripcion1: Subscription;
  private suscripcion2: Subscription;
  private suscripcion3: Subscription;
  private suscripcion4: Subscription;
  private suscripcion5: Subscription;



  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

 

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private plt: Platform
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      //console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }

  ngOnInit() {
    if (this.contInit == 0) {
      //console.log('se ejecuta init');
      this.dataUser();
      this.getMateriaEstudiante();
    }
  }

  ionViewWillEnter() {
    this.contInit = this.contInit + 1;
    if (this.contInit > 1) {
      //console.log('se ejecuta initView');
      this.dataUser();
      this.getMateriaEstudiante();
    }
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }


  ionViewDidLeave() {
    this.stopScan();
    if (this.suscripcion1) {
      this.suscripcion1.unsubscribe();
      //console.log('se cancela la suscripcion 1');
    }
    if (this.suscripcion2) {
      this.suscripcion2.unsubscribe();
      //console.log('se cancela la suscripcion 2');
    }
  }

  ngOnDestroy(){
    this.stopScan();
    if (this.suscripcion1) {
      this.suscripcion1.unsubscribe();
      //console.log('se cancela la suscripcion 1');
    }
    if (this.suscripcion2) {
      this.suscripcion2.unsubscribe();
      //console.log('se cancela la suscripcion 2');
    }
  }



  // Helper functions
  async showQrToast() {
    var informacion = '2sllmtu2=uTZq@%%jl9w'
    //variable con la información del código qr
    ////console.log('resultado', this.scanResult)
    //aqui leer el qr y registrar la asistencia
    var cadena = CryptoJS.AES.decrypt(this.scanResult.trim(), informacion.trim()).toString(CryptoJS.enc.Utf8);
    this.splitted = cadena.split("//");
    ////console.log('ver splitted', this.splitted, 'valor', this.splitted.length);
    if (this.splitted.length === 5) {
      this.idProfesor = this.splitted[0];
      this.idMateria = this.splitted[1];
      this.idCurso = this.splitted[2];
      this.idNomina = this.splitted[3];
      this.codigoQr = this.splitted[4];

      ////console.log('cadena', cadena);
      ////console.log('datos profesor',  this.idProfesor);
      ////console.log('datos curso',  this.idCurso);
      ////console.log('datos materia',  this.idMateria);

      this.getMateria(this.idProfesor, this.idMateria, this.idCurso);
    }
    else {
      this.authService.showError('Código QR desconocido. Vuelva a intentarlo');
      //this.startScan();
    }

  }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.authService.finalizarScanner();
    this.scanActive = false;
    this.scanResult = null;
    this.validacionCurso = false;
    this.validacionMateria = false;
    this.validacionNomina = false;
    this.validacionGuardado = false;
    this.validacionBar = false;
    if (this.suscripcion3) {
      this.suscripcion3.unsubscribe();
      //console.log('se cancela la suscripcion 3');
    }
    if (this.suscripcion4) {
      this.suscripcion4.unsubscribe();
      //console.log('se cancela la suscripcion 4');
    }
    if (this.suscripcion5) {
      this.suscripcion5.unsubscribe();
      //console.log('se cancela la suscripcion 5');
    }
  }

  async startScan() {
    this.authService.iniciaScanner();
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.showQrToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  //primero se obtiene la informacion del usuario
  dataUser() {
    this.suscripcion1 = this.authService.getDataUser().subscribe((data) => {
      this.uidEstudiante = data.payload.id;
      let dataUser: any = data.payload.data();
      this.nombre = dataUser.nombre;
      this.apellido = dataUser.apellido;
      this.perfil = dataUser.photoUrl;
      this.correo = dataUser.email;
      this.codigoUnico = dataUser.codigoUnico;
      //console.log('este es el usuario', dataUser);
    });
  }

  //segundo se ejecuta la obtencio de inforamcion de los cursos del estudiante
  getMateriaEstudiante() {
    this.suscripcion2 = this.authService.getDataMateria().subscribe(data => {
      this.materiasEstudiante.length = 0;
      data.forEach(dataEstuiante => {
        this.materiasEstudiante.push(
          dataEstuiante.payload.doc.data().idCurso
        )
      })
      //console.log('materias', this.materiasEstudiante);
    })
  }

  //se obtiene la informacion acerca de la materia a registrarse
  getMateria(idProfesor: any, idMateria: any, idCurso: any) {
    this.validacionBar = true;
    this.startTimerMateria();
    this.suscripcion3 = this.authService.getMateriaId(idProfesor, idMateria).subscribe((data: any) => {

      if (data.payload.data()) {
        this.validacionMateria = true;
        this.timeLeft = 3;
        let datos: any = data.payload.data();

        datos.cursos.forEach((element: any) => {
          if (element.id === idCurso) {
            this.nombreMateria = datos.nombre;
            this.aulaSeleccionada = element.aula;
            this.datosAlmacenar = {
              correo: this.correo,
              idCurso: idCurso,
              idProfesor: idProfesor,
              uidMateria: idMateria,
              uidNomina: element.uidNomina
            }
            this.validacionCurso = true
          }
        })

        ////console.log(validacion);
        if (this.validacionCurso) {
          this.pauseTimer();
          this.timeLeft = 3;
          this.getNomina(this.idProfesor, this.idMateria, this.idNomina, this.codigoQr)
        } else {
          this.validacionMateria = false;
        }
      } else {
        this.validacionMateria = false;
      }
    });
  }




  getNomina(idProfesor: any, idMateria: any, idNomina: any, codigoQr: any) {
    //console.log('llega al getnomina');
    this.startTimerNomina();
    this.suscripcion4 = this.authService.getDataNominaCursoId(idProfesor, idMateria, idNomina).subscribe((data: any) => {
      //console.log(data.payload.data(), this.codigoQr)

      if (data.payload.data()) {
        let dataNomina: any = data.payload.data();

        if (codigoQr != dataNomina.code) {
          this.validacionNomina = false;
        } else {
          this.validacionNomina = true;
          this.timeLeft = 3;
          dataNomina.nomina.forEach(element => {
            //console.log(this.correo, element.correo)
            if (this.correo != element.correo) {

            } else {
              //valida si se encuntra registrado el estudiante en el sistema
              this.validacionGuardado = true;
              this.timeLeft = 3;

              //validar si el estuiante no tiene asistencias
              if (element.asistencia.length == 0 && dataNomina.historial.length > 1) {
                for (let i = 0; i < dataNomina.historial.length - 1; i++) {
                  let splitted = dataNomina.historial[i].split("//");
                  let dia = splitted[0];
                  let fecha = splitted[1];
                  element.asistencia.push({
                    presente: false,
                    atraso: false,
                    falta: true,
                    fecha: fecha,
                    dia: dia,
                    estado: false
                  })
                  //console.log(dia, fecha, element);
                }
              }

              //console.log('estos son los valores', element.asistencia.length, Number(dataNomina.numeroAlmacenado));

              if (element.asistencia.length == Number(dataNomina.numeroAlmacenado)) {
                let splittedUltimo = dataNomina.historial[dataNomina.historial.length - 1].split("//");
                let diaUltimo = splittedUltimo[0];
                let fechaUltimo = splittedUltimo[1];
                if (dataNomina.estado == 'presente') {
                  element.asistencia.push({
                    presente: true,
                    atraso: false,
                    falta: false,
                    fecha: fechaUltimo,
                    dia: diaUltimo,
                    estado: true
                  })
                } else if (dataNomina.estado == 'atraso') {
                  element.asistencia.push({
                    presente: false,
                    atraso: true,
                    falta: false,
                    fecha: fechaUltimo,
                    dia: diaUltimo,
                    estado: true
                  })
                }

                //actualizacion de tabla nomina con ls datos el estudiante
                element.image = this.perfil;
                element.uidUser = this.uidEstudiante;
                element.nombre = this.nombre + ' ' + this.apellido;
                element.codigoUnico = this.codigoUnico;
                ////console.log('sip array de asistencia',element.asistencia.length);

                //almacenamiento de la nueva nomina
                let data = this.authService.updateNominaEstudiante(idProfesor, idMateria, idNomina, dataNomina.nomina);

                //console.log(this.materiasEstudiante)

                if (this.materiasEstudiante.includes(this.idCurso)) {

                } else {
                  this.authService.createMateria(this.datosAlmacenar);
                }

                if (data) {
                  this.stopScan();
                  this.pauseTimer();
                  this.timeLeft = 3;
                  this.authService.showInfo('Su Asistencia Ha Sido Registrado');
                }

              } else {
                this.stopScan();
                this.pauseTimer();
                this.timeLeft = 3;
                this.authService.showInfo('Su Asistencia Ya Esta Registrada');
              }
            }
          });
        }
      }


    });
  }

  oberserableTimer() {
    const source = timer(1000, 2000);
    this.suscripcion5 = source.subscribe(val => {
      //console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimerMateria() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        if (this.validacionCurso == false || this.validacionMateria == false) {
          this.authService.showInfo('La Curso Ya No Esta Disponible');
          this.stopScan();
        }
        this.pauseTimer();
        this.timeLeft = 3;
      }
    }, 1000)
  }

  startTimerNomina() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        if (this.validacionNomina == false) {
          this.authService.showError('Codigo Invalido');
          this.stopScan();
        } else {
          if (this.validacionGuardado == false) {
            this.authService.showInfo('Usted no esta registrado en el curso ' + this.nombreMateria + ' ' + this.aulaSeleccionada);
            this.stopScan();
          }
        }

        this.pauseTimer();
        this.timeLeft = 3;
      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

}
