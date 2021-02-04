import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  validate=true;

  Form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email,this.matchEmail()])
  })


  constructor(
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  async onReset() {
    try {
      this.validate=false;
      const { email } = this.Form.value;
      await this.authService.resetPassword(email);
      this.authService.showInfo('Solicitud enviada con éxito');
      this.validate=true;
      this.router.navigate(['/home']);
    } catch (error) {
      this.validate=true;
    }
  }

  matchEmail() {
    return (control: AbstractControl): { [s: string]: boolean } => {
      if (control.parent) { // en las primeras llamadas control.parent es undefined
        let dominio=control.value.split("@", 2);
        if (dominio[1] !== 'epn.edu.ec') {
          return {
            match: true
          };
        }
      }
      return null;
    };
  }


}
