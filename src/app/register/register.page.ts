import { Component, OnInit,Input } from '@angular/core';

import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validacionPass:boolean = false;

  registerForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    _password: new FormControl('', [Validators.required, Validators.minLength(6),this.match('password')]),
    codigoUnico: new FormControl('',[Validators.required, Validators.minLength(9)])
  })

  constructor(
    public modalController:ModalController,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
  }
  
  dismiss(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async onRegister(){
    try{
      const { email,password,nombre,apellido,codigoUnico } = this.registerForm.value;
      const user = await this.authService.register(email,password,nombre,apellido,codigoUnico);
      if(user){
        this.modalController.dismiss();
        this.router.navigate(['/send-email-component']);
      }
    }catch(error){
      this.authService.showError(error);
    }
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.authService.showInfo('No se admite el ingreso de letras');
      return false;
    }
  }

  match(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      // control.parent es el FormGroup
      if (control.parent) { // en las primeras llamadas control.parent es undefined
        const checkValue = control.parent.controls[controlKey].value;
        if (control.value !== checkValue) {
          console.log('no son iguales');
          this.validacionPass=false;
          return {
            match: true
          };
        }
      }
      console.log('iguales');
      this.validacionPass=true;
      return null;
    };
  }

}
