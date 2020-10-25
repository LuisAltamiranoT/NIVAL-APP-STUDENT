import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/user.interface';

import {AngularFireAuth} from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth:AngularFireAuth
  ) { }


  /*async login(): Promise<User>{
    
  }

  async register(): Promise<User>{
    
  }

  async resetPassword(): Promise<User>{
    
  }*/

  async sendVerificationEmail(): Promise<void>{
    
  }

  async logout(): Promise<void>{
    try{

    }catch(error){
      console
    }
  }
}
