import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validate=true;
  hide = true;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
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
