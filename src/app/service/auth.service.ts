import { Injectable } from '@angular/core';
//toast
import { ToastController } from '@ionic/angular';

<<<<<<< HEAD
import { User, Curso, Materia } from 'src/app/shared/user.interface';
=======
import { User, Curso } from 'src/app/shared/user.interface';
>>>>>>> 4c81420057d342d5a6f031359bd6c710263b4316
import { RoleValidator } from 'src/app/helpers/rolValidator';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

<<<<<<< HEAD
import { Observable, of } from 'rxjs';
import { first, map, mergeMap, switchMap, take } from 'rxjs/operators';
=======
import { Observable, of, Subject } from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';
>>>>>>> 4c81420057d342d5a6f031359bd6c710263b4316

//import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {
  //observable y subject
  private estadoImgenUpdate = new Subject<void>();
  public finalizoImage$ = this.estadoImgenUpdate.asObservable();
  
  public user$: Observable<User>;

  private dataUser: any;


  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public toast: ToastController
  ) {
    super();
    //es utilizado en el guard
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.dataUser = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges().pipe(
            first(data => data.role === 'EDITOR' || data.role === 'ADMIN')
          )
        }
        return of(null);
      })
    )
  }



  verifyConnection(): boolean {
    if (navigator.onLine) {
      console.log('true');
      return true;
    } else {
      console.log('true');
      return false;
    }
  }

  //Obtener Datos
  public getDataUser() {
    try {
      let db = this.afs.doc<User>(`users/2JGiKUIFzSSPuCB21xNmxCjs2N13`).snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }

  //Obtener Datos
  public getDataProfesor(datos: any) {
    try {
      let db = this.afs.doc<User>(`users/${datos}`).snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.updateUserData(user);
      return user;
    } catch (error) {
      this.showError(error);
    }
  }

  async

  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }


  //registro estudiantte
  async register(email: string, password: string, nombre: string, apellido: string, codigoUnico: string): Promise<User> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (user) {
        await this.registerDataUser(user, nombre, apellido, codigoUnico);
      }
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      this.showError(error);
    }
  }

  private async registerDataUser(user: User, nombre: string, apellido: string, codigoUnico: string) {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
      const data: User = {
        uid: user.uid,
        nombre: nombre,
        apellido: apellido,
        email: user.email,
        emailVerified: user.emailVerified,
        codigoUnico: codigoUnico,
        role: 'EDITOR'
      };

      return await userRef.set(data, { merge: true });

    } catch (error) {
      this.showError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      this.showError(error);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      this.showError(error);
    }
  }

  //sali de la apliccion
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      this.showError(error);
    }
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    };
    //si existe que realixe merge
    return userRef.set(data, { merge: true });
  }

  //crear materia
  public async createMateria(data: any) {
    try {
      const create = await this.afs.doc<any>(`users/${this.dataUser}`).collection('materiasEstudiante').add(data);
      this.showRegisterQR();
      return create;
    } catch (error) {
      this.showError(error);
    }
  }

  //imagen
  public async updatePhoto(valor: any) {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.dataUser}`);
      const data: User = {
        photoUrl: valor
      };
      await userRef.set(data, { merge: true });
      this.estadoImgenUpdate.next();

    } catch (error) {
      this.showError(error);
    }
  }


  //toast Info
  async showInfo(mensaje: string) {
    let color = 'secondary';
    this.presentToast(mensaje, color);
  }

  //toast Error
  async showError(mensaje: string) {
    let color = 'danger';
    this.presentToast(mensaje, color);
  }

  //toast Succes
  async showSuccess(mensaje: string) {
    let color = 'success';
    this.presentToast(mensaje, color);
  }

  showUpdatedata() {
    this.showSuccess("Se ha actualizado su información");
  }

  showRegisterQR() {
    this.showSuccess("Usted se ha registrado en este curso");
  }

  //informacion del profesor
  public getDataTeacher(idUser: any) {
    try {
      let db = this.afs.doc<User>(`users/${idUser}`).snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }

  //informacion del curso
  public getDataCursoId(idUser: any, id: any) {
    try {
      let db = this.afs.doc<Curso>(`users/${idUser}`).collection('cursos').doc(id).snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }

  //Obtener la materia con el id
  /*  public getMateriaId(idUser: any, id: any) {
      try {
        let db = this.afs.doc<Curso>(`users/${idUser}`).collection('materias').doc(id).snapshotChanges();
        return db;
      } catch (error) {
        this.showError(error);
      }
    }*/
  public getMateriaId(idProfesor: any, id: any) {
    try {
      let db = this.afs.doc<Curso>(`users/${idProfesor}`).collection('materias').doc(id).snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }

  //nombre
  public async updateName(valor: string) {
    this.verifyConnection();
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.dataUser}`);
      const data: User = {
        nombre: valor
      };
      const dataUpdate = await userRef.set(data, { merge: true });
      console.log('asdasdasjdkasbdhasjd' + dataUpdate);


      return { dataUpdate };

    } catch (error) {
      this.showError(error);
    }
  }


  //apellido
  public async updateLastName(valor: string) {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.dataUser}`);
      const data: User = {
        apellido: valor
      };
      const dataUpdate = await userRef.set(data, { merge: true });
      return { dataUpdate };

    } catch (error) {
      this.showError(error);
    }
  }

  //codigoUnico
  public async updateCodigoUnico(valor: string) {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.dataUser}`);
      const data: User = {
        codigoUnico: valor
      };
      const dataUpdate = await userRef.set(data, { merge: true });
      return { dataUpdate };

    } catch (error) {
      this.showError(error);
    }
  }


  //password
  public async updatePass(oldPass: string, newPass: string): Promise<Number> {
    //estado cero no se logro, estado 1 se ha logrado 
    const user = firebase.auth().currentUser;
    let data: number;
    try {
      await this.reauthenticate(oldPass);
      await user.updatePassword(newPass);
      data = 1;
      console.log(data + "se ha actualizado");
      return data;
    } catch (error) {
      this.showError(error);
      return data = 0;
    }
  }

  private reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var credential = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword
    );
    return user.reauthenticateWithCredential(credential);
  }

  public getDataMateria() {
    try {
      let db = this.afs.doc<any>(`users/${this.dataUser}`).collection('materiasEstudiante').snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }


  async presentToast(mensajeToast: string, colorToast: string) {
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

    //Actuzalizar cursos
    public async upadteCursoJson() {
      try {
        const datosActualizar = {
          cursos: [
            {
              id: '1234',
              aula: 'gr4',
              photo: 'asdsad',
              horario: [
                {
                  dia: 'lunes',
                  posicion: 10
                },
                {
                  dia: 'Martes',
                  posicion: 10
                }
              ]
            }
          ]
        }
        const create = await this.afs.doc(`users/${this.dataUser}`).collection('materias');
      
        return create;
      } catch (error) {
        this.showError(error);
      }
    }

  public async createMateriaJson() {
    try {
      const data = {
        nombre: 'matematicas2',
        cursos: [
          {
            id: '1234',
            aula: 'gr4',
            photo: 'asdsad',
            horario: [
              {
                dia: 'lunes',
                posicion: 10
              },
              {
                dia: 'Martes',
                posicion: 10
              }
            ]
          }
        ]
      }
      const create = await this.afs.doc(`users/${this.dataUser}`).collection('materias').add(data);
      return create;
    } catch (error) {
      this.showError(error);
    }
  }

  public getMaterias() {
    try {
      let db = this.afs.doc<Curso>(`users/${this.dataUser}`).collection('materias').snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }
  public getMateriaPrueba() {
    try {
      let db = this.afs.collectionGroup('materias', ref => ref.where('nombre', '==', 'mate')).snapshotChanges();
      return db;
    } catch (error) {
      this.showError(error);
    }
  }
}
