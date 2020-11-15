import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validate=true;
  hide = true;

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email,this.matchEmail()]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
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

  async onLogin() {
    try {
      this.validate=false;
      const { email, password } = this.loginForm.value;
      const user = await this.authService.login(email, password);

      if(!user){
        this.validate=true;
      }

      if (user.emailVerified) {
        this.router.navigate(['/admin']);
        this.dismiss();
        this.validate=true;
      } else if (user) {
        this.dismiss();
        this.router.navigate(['/verification-email']);
        this.validate=true;
      }

    } catch (error) {

    }
  }

  matchEmail() {
    return (control: AbstractControl): { [s: string]: boolean } => {
      // control.parent es el FormGroup
      if (control.parent) { // en las primeras llamadas control.parent es undefined
        let dominio=control.value.split("@", 2);
        //console.log(dominio[1],dominio.length);
        if (dominio[1] !== 'epn.edu.ec') {
          //console.log(control.value,'no pertenece al dominio');
          //this.validacionEmail=false;
          return {
            match: true
          };
        }
      }
      //console.log('iguales');
      //this.validacionEmail=true;
      return null;
    };
  }

}
