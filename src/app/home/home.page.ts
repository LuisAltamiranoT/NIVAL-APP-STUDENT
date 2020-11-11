import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public modalController:ModalController
  ) {}

  async openModal(){
    const modal = await this.modalController.create({
      component:RegisterPage,
      cssClass:''
    });
    return await modal.present();
  }

  async openModalLogin(){
    const modal = await this.modalController.create({
      component:LoginPage,
      cssClass:''
    });
    return await modal.present();
  }

  

}
