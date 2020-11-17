import { Injectable } from '@angular/core';
//toast
import { ToastController } from '@ionic/angular';

import { User } from 'src/app/shared/user.interface';
import { RoleValidator } from 'src/app/helpers/rolValidator';

import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import {Observable, of} from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';

//import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {

  public user$: Observable<User>;

  private dataUser: any;

  constructor(
    public afAuth:AngularFireAuth,
    private afs:AngularFirestore,
    public toast:ToastController
  ) {
    super();
     //es utilizado en el guard
     this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.dataUser = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges().pipe(
            first(data => data.role==='EDITOR'|| data.role==='ADMIN')
          )
        }
        return of(null);
      })
    )
   }

   public getDataUser() {
    try {
      let db = this.afs.doc<User>(`users/${this.dataUser}`).valueChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }

  async login(email:string, password:string): Promise<User>{
    try{
      await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const {user}= await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.updateUserData(user);
      return user;
    }catch(error){
      this.showError(error);
    }
  }

  async

  isEmailVerified(user:User): boolean{
    return user.emailVerified === true ? true : false;
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
