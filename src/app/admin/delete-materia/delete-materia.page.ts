import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { DeletePage } from 'src/app/perfil/delete/delete.page';


@Component({
  selector: 'app-delete-materia',
  templateUrl: './delete-materia.page.html',
  styleUrls: ['./delete-materia.page.scss'],
})
export class DeleteMateriaPage implements OnInit {

  validate = true;
  materia = "";
  idMateriaEstudiante: any = '';

  materiaForm = new FormGroup({
    //materia: new FormControl('')
  })

  constructor(
    public dialogRef: MatDialogRef<DeleteMateriaPage>,
    @Inject(MAT_DIALOG_DATA) public infoUser: any,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.materia = this.infoUser.nombre;
    this.idMateriaEstudiante = this.infoUser.idMateria;
    console.log(this.infoUser);
  }


  onClick() {
    try {
      this.authService.delecteMateriaId(this.infoUser.idMateria);
      this.validate = true;
      this.dialogRef.close();
    } catch (error) {

    }
  }

  dimissModal() {
    this.dialogRef.close();
  }


}
