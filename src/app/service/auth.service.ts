import { Injectable } from '@angular/core';
//toast
import { ToastController } from '@ionic/angular';

import { User, Curso } from 'src/app/shared/user.interface';
import { RoleValidator } from 'src/app/helpers/rolValidator';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of, Subject } from 'rxjs';
import { first, switchMap, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {
  //observable y subject
  private estadoImgenUpdate = new Subject<void>();
  public finalizoImage$ = this.estadoImgenUpdate.asObservable();

  public stateScanner= new Subject<any>();

  public user$: Observable<User>;
  public stateUser$: Observable<any>;

  private dataUser: any;
  private MEDIA_STORAGE_PATH_PERFIL = 'perfil';


  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public toast: ToastController,
    private storage: AngularFireStorage,
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

    this.stateUser$ = this.afAuth.authState.pipe(map(auth => auth));
  }


  //Obtener Datos
  public getDataUser() {
    try {
      let db = this.afs.doc<User>(`users/${this.dataUser}`).snapshotChanges();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  //Obtener Datos
  public getDataProfesor(datos: any) {
    try {
      let db = this.afs.doc<User>(`users/${datos}`).snapshotChanges();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.updateUserData(user);
      return user;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }


  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }


  //Obtener la nomina del curso
  public getDataNominaCursoId(idProfesor: any, idMateria: any, idNomina: any) {
    try {
      let db = this.afs.doc<any>(`users/${idProfesor}`).collection('materias').doc(idMateria).collection('nomina').doc(idNomina).snapshotChanges();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }


  //actualizar estudiante en la nomina el profesor
  public async updateNominaEstudiante(idProfesor: any, idMateria: any, idNomina: any, array: any): Promise<void> {
    let data = {
      nomina: array
    }
    try {
      let db = await this.afs.doc(`users/${idProfesor}`).collection('materias').doc(idMateria).collection('nomina').doc(idNomina).set(data, { merge: true });
      //this.showUpdatedata();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
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
       this.showError('Verifica los datos. Algo salio mal');
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
        role: 'EDITOR',
        photoUrl:''
      };

      return await userRef.set(data, { merge: true });

    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  //sali de la apliccion
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
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
      //this.showRegisterQR();
      return create;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  public delecteMateria(documentId: any) {
    try {
      this.afs.doc(`users/${this.dataUser}`).collection('materiasEstudiante').doc(documentId).delete();
    } catch (error) {
    }
  }

  public delecteMateriaId(documentId: any){
    try {
      this.afs.doc(`users/${this.dataUser}`).collection('materiasEstudiante').doc(documentId).delete();
      this.showDeletedata();
    } catch (error) {
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
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  showDeletedata() {
    this.showSuccess("Se ha eliminado la información");
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
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  //informacion del curso
  public getDataCursoId(idUser: any, id: any) {
    try {
      let db = this.afs.doc<Curso>(`users/${idUser}`).collection('cursos').doc(id).snapshotChanges();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  public getMateriaId(idProfesor: any, id: any) {
    try {
      let db = this.afs.doc<Curso>(`users/${idProfesor}`).collection('materias').doc(id).snapshotChanges();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  //nombre
  public async updateName(valor: string) {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.dataUser}`);
      const data: User = {
        nombre: valor
      };
      const dataUpdate = await userRef.set(data, { merge: true });


      return { dataUpdate };

    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
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
       this.showError('Verifica los datos. Algo salio mal');
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
       this.showError('Verifica los datos. Algo salio mal');
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
      return data;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
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
       this.showError('Verifica los datos. Algo salio mal');
    }
  }


  public getDataMateriaId(idMateria: any) {
    try {
      let db = this.afs.doc<any>(`users/${this.dataUser}`).collection('materiasEstudiante').doc(idMateria).snapshotChanges();
      return db;
    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }




  async presentToast(mensajeToast: string, colorToast: string) {
    const toast = await this.toast.create({
      color: colorToast,
      message: mensajeToast,
      duration: 3000,
      position: 'top',
      cssClass: "toastClass",
      //showCloseButton: true
    });
    toast.present();
  }

  //cambiar el estado del escaner
  public iniciaScanner(){
    this.stateScanner.next({estado:false});
  }

  public finalizarScanner(){
    this.stateScanner.next({estado:true});
  }

  //Delete user
 public async updateAcoountUser(oldPass: string, imagen: any): Promise<Number> {
    let data: number;
    try {
      let userAccount = firebase.auth().currentUser;
      await this.reauthenticate(oldPass);
      await this.updateEstadoEliminar();
      

      if (imagen != '') {
        let splitted = imagen.split("perfil%2F")[1];
        let name = splitted.split("?alt")[0];
        const fileref = this.storage.ref(`${this.MEDIA_STORAGE_PATH_PERFIL}/${name}`);
        fileref.delete();
      } 

      await userAccount.delete();
      this.showSuccess('Usted ha eliminado su cuenta de NIVAL EASY ATTENDANCE CONTROL');
      this.logout();
      return data = 1;
    } catch (error) {
      this.showError('Verifica los datos. Algo salio mal');
      return data = 0;
    }
  }

  public async updateEstadoEliminar() {
    try {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.dataUser}`);
      const data = {
        EliminarCuenta: 'EliminarCuenta'
      };
      const dataUpdate = await userRef.set(data, { merge: true });
      this.showUpdatedata();
      return { dataUpdate };

    } catch (error) {
       this.showError('Verifica los datos. Algo salio mal');
    }
  }

  public deleteImagePerfil(imageName: string) {
    let splitted = imageName.split("perfil%2F")[1];
    let name =  splitted.split("?alt")[0];
    const fileref = this.storage.ref(`${this.MEDIA_STORAGE_PATH_PERFIL}/${name}`);
    fileref.delete();
  }
}
