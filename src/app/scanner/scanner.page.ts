import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import * as CryptoJS from 'crypto-js'
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  image = "src/assets/profe.jpg";
  perfil = "https://firebasestorage.googleapis.com/v0/b/easyacnival.appspot.com/o/imageCurso%2FwithoutUser.jpg?alt=media&token=61ba721c-b7c1-42eb-8712-829f4c465680";
  nombre = "Prueba";
  apellido = "Prueba";
  codigoUnico = "";
  correo = "";
  password = "";
  uidEstudiante: any;
  //datos a almacenar 
  datosAlmacenar: any;


  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  private suscripcion1: Subscription;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private plt: Platform
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }

  ngOnInit() {
    this.startScan();
    this.dataUser();
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }

  // Helper functions
  async showQrToast() {
    var informacion = '2sllmtu2=uTZq@%%jl9w'
    //variable con la información del código qr
    console.log('resultado', this.scanResult)
    //aqui leer el qr y registrar la asistencia
    var cadena = CryptoJS.AES.decrypt(this.scanResult.trim(), informacion.trim()).toString(CryptoJS.enc.Utf8);
    let splitted = cadena.split("//");
    console.log('ver splitted', splitted, 'valor', splitted.length);
    if (splitted.length === 5) {
      var idProfesor = splitted[0];
      var idMateria = splitted[1];
      var idCurso = splitted[2];
      var idNomina = splitted[3];
      var codigoQr = splitted[4];

      //console.log('cadena', cadena);
      //console.log('datos profesor', idProfesor);
      //console.log('datos curso', idCurso);
      //console.log('datos materia', idMateria);
      //console.log('datos materia', idMateria);

      this.getMateria(idProfesor, idMateria, idCurso);
      this.getNomina(idProfesor, idMateria, idNomina, codigoQr)
    }
    else {
      this.authService.showError('Código QR desconocido. Vuelva a intentarlo');
      //this.startScan();
    }

  }

  async startScan() {
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

  handleFile(files: FileList) {
    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
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
        this.scanResult = code.data;
        this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  materias = [];
  image_curso: any;
  num_aula: any;

  //primera parte comprueba el qr y realiza la actualizacion en la nomina
  dataUser() {
    this.suscripcion1 = this.authService.getDataUser().subscribe((data) => {
      this.uidEstudiante = data.payload.id;
      let dataUser: any = data.payload.data();
      this.nombre = dataUser.nombre;
      this.apellido = dataUser.apellido;
      this.perfil = dataUser.photoUrl;
      this.correo = dataUser.email;
      this.codigoUnico = dataUser.codigoUnico;
      console.log('este es el usuario', dataUser);
    });
  }

  getMateria(id_profe: any, idMateria: any, idCurso: any) {
    this.suscripcion1 = this.authService.getMateriaId(id_profe, idMateria).subscribe((data) => {
      this.materias.length = 0;
      let datos: any = data.payload.data();

      datos.cursos.forEach((element: any) => {
        if (element.id === idCurso) {
          console.log('entra al cusro', element.id);
          this.datosAlmacenar = {
            profesor: datos.profesor,
            idProfesor: datos.uidProfesor,
            photoProfesor: datos.photoUrl,
            materia: datos.nombre,
            photoCurso: element.image,
            aula: element.aula
          }
        }
      })
    });
  }

  getNomina(idProfesor: any, idMateria: any, idNomina: any, codigoQr: any) {
    this.suscripcion1 = this.authService.getDataNominaCursoId(idProfesor, idMateria, idNomina).subscribe((data) => {
      let dataNomina: any = data.payload.data();
      //console.log('extraeno',dataNomina);
      if (codigoQr != dataNomina.code) {
        this.authService.showError('Codigo Invalido');
      } else {
        var guardado = false
        dataNomina.nomina.forEach(element => {
          if (this.correo != element.correo) {
            //this.authService.showInfo('Usten no esta registrado en la Materia'+this.datosAlmacenar.materia);
          } else {
            //valida si se encuntra registrado el estudiante en el sistema
            guardado = true;
            //validar si el estuiante no tieneasistencias
            if (element.asistencia.length == 0 && dataNomina.numeroAlmacenado != 0) {
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
                console.log(dia, fecha, element);
              }
            }
            
            if (element.asistencia.length == dataNomina.numeroAlmacenado) {
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
              }else if (dataNomina.estado == 'atraso') {
                element.asistencia.push({
                  presente: false,
                  atraso: true,
                  falta: false,
                  fecha: fechaUltimo,
                  dia: diaUltimo,
                  estado: true
                })
              }
            }
            //actualizacion de tabla nomina con ls datos el estudiante
            element.image = this.perfil;
            element.uidUser = this.uidEstudiante;
            element.nombre = this.nombre;
            element.codigoUnico = this.codigoUnico;
            //console.log('sip array de asistencia',element.asistencia.length);
            this.authService.updateNominaEstudiante(idProfesor,idMateria,idNomina,dataNomina);
            this.authService.createMateria(this.datosAlmacenar);
          }
        });
        if (guardado) {
        } else {
          this.authService.showInfo('Usten no esta registrado en el curso ' + this.datosAlmacenar.materia + ' ' + this.datosAlmacenar.aula);
        }
      }
    });
  }

}
