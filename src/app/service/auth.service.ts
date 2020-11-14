import { Injectable } from '@angular/core';
//toast
import { ToastController } from '@ionic/angular';

import { User } from 'src/app/shared/user.interface';

import {AngularFireAuth} from '@angular/fire/auth';

import {AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import {Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>;

  constructor(
    private afAuth:AngularFireAuth,
    private afs:AngularFirestore,
    public toast:ToastController
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) =>{
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    )
   }


  async login(email:string, password:string): Promise<User>{
    try{
      const {user}= await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    }catch(error){
      this.showError(error);
    }
  }

  //registro estudiantte
  async register(email:string,password:string,nombre:string,apellido:string,codigoUnico:string): Promise<User>{
    try{
      const {user}= await this.afAuth.createUserWithEmailAndPassword(email,password);
      if(user){
        await this.registerDataUser(user,nombre,apellido,codigoUnico);
      }
      await this.sendVerificationEmail();
      return user;
    }catch(error){
      this.showError(error);
    }
  }

  private async registerDataUser(user: User, nombre: string, apellido: string, codigoUnico:string){
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
      const data: User = {
        uid: user.uid,
        nombre: nombre,
        apellido: apellido,
        email: user.email,
        emailVerified: user.emailVerified,
        codigoUnico:codigoUnico,
        role: 'EDITOR'
      };

      return await userRef.set(data, { merge: true });

    } catch (error) {
      this.showError(error);
    }
  }

  async resetPassword(email:string): Promise<void>{
    try{
      return this.afAuth.sendPasswordResetEmail(email);
    }catch(error){
      this.showError(error);
    }
  }

  async sendVerificationEmail(): Promise<void>{
    try{
      return (await this.afAuth.currentUser).sendEmailVerification();
    }catch(error){
      this.showError(error);
    }
  }

  //sali de la apliccion
  async logout(): Promise<void>{
    try{
      await this.afAuth.signOut();
    }catch(error){
      this.showError(error);
    }
  }

  private updateUserData(user: User){
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid:user.uid,
      email:user.email,
      emailVerified:user.emailVerified
    };
    //si existe que realixe merge
    return userRef.set(data, {merge:true});
  }

  //toast Info
  async showInfo(mensaje:string){
    let color= 'secondary';
    this.presentToast(mensaje,color);
  }

   //toast Error
   async showError(mensaje:string){
    let color= 'danger';
    this.presentToast(mensaje,color);
  }

  async presentToast(mensajeToast:string,colorToast:string) {
    const toast = await this.toast.create({
      color: colorToast,
      message: mensajeToast,
      duration: 2000,
      position: 'top',
      cssClass: "toastClass",
      //showCloseButton: true
    });
    toast.present();
  }

}
