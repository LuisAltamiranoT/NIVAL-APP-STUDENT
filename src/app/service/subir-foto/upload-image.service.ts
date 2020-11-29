import { Injectable } from '@angular/core';
import { FileI } from 'src/app/shared/user.interface';
// Observable y subject permite ejecutar una acción al cumplirse una condición
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

import { AuthService } from 'src/app/service/auth.service';
import { ImageValidator } from 'src/app/shared/helpers/imageValidators';


@Injectable({
  providedIn: 'root'
})

export class UploadImageService extends ImageValidator {
  private filePath: any;
  private downloadURL: Observable<string>;
  private MEDIA_STORAGE_PATH = 'imageCurso';
  private MEDIA_STORAGE_PATH_PERFIL = 'perfil';
  public nominaDat: any;
  public nominaHorario: any;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {
    super();
  }


  private generateFileName(name: string, filenameFs: string): string {
    return `${filenameFs}/${new Date().getTime()}_${name}`;
  }


  public preAddAndUpdatePerfil(image: FileI) {
    let item = false;
    this.filePath = this.generateFileName(image.name, this.MEDIA_STORAGE_PATH_PERFIL);
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    let dataTsk = task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlImage => {
          this.downloadURL = urlImage;
            this.addPhoto();
        });
      })
    ).subscribe();
  }

  public async addPhoto() {
    let info = await this.authService.updatePhoto(this.downloadURL);
    return info;
  }

  public deleteImagePerfil(imageName: string) {
    let splitted = imageName.split("perfil%2F")[1];
    let name =  splitted.split("?alt")[0];
    const fileref = this.storage.ref(`${this.MEDIA_STORAGE_PATH_PERFIL}/${name}`);
    fileref.delete();
  }

}