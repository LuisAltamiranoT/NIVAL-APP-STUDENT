import { Component, OnInit,Input } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    _password: new FormControl(''),
  })

  constructor(
    public modalController:ModalController
  ) { }

  ngOnInit() {
  }
  
  dismiss(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
