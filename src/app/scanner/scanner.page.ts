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
    if(splitted.length === 4){
      var idProfesor = splitted[0];
      var idMateria = splitted[1];
      var idCurso = splitted[2];
      var idNomina = splitted[3];
      console.log('cadena', cadena);
      console.log('datos profesor', idProfesor);
      console.log('datos curso', idCurso);
      console.log('datos materia', idMateria);
      this.getMateria(idProfesor, idMateria, idCurso);
    }
    else {
      this.authService.showError('Código QR desconocido. Vuelva a intentarlo');
      this.startScan();
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
  getMateria(id_profe, idMateria, idCurso) {
    this.suscripcion1 = this.authService.getMateriaId(id_profe, idMateria).subscribe((data) => {
      this.materias.length = 0;
      let datos: any = data.payload.data();
      console.log('datos', datos);
      var name_profesor = datos.profesor;
      var name_materia = datos.nombre;
      var idprofesor = datos.uidProfesor;
      var imagen = datos.photoUrl;
      console.log('profesor ', name_profesor, 'materia ', name_materia, 'id_profesor ', idprofesor, 'imagen ', imagen)
      datos.cursos.forEach((element: any) => {
        console.log('elementos ', element.image, element.aula, element.uidNomina);
        if (element.id === idCurso) {
          console.log('entra al cusro', element.id);
          this.image_curso = element.image;
          this.num_aula = element.aula
        }
      })
      var datosAlmacenar = {
        profesor: name_profesor,
        idProfesor: idprofesor,
        photoProfesor: imagen,
        materia: name_materia,
        photoCurso: this.image_curso,
        aula: this.num_aula
      }

      console.log('datos totales', datosAlmacenar);
      this.registrarMateria(datosAlmacenar)
    });
  }

  registrarMateria(data: any) {
    const dat = this.authService.createMateria(data);
  }
}
