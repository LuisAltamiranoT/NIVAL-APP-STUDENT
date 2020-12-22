import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-codigo-unico',
  templateUrl: './codigo-unico.page.html',
  styleUrls: ['./codigo-unico.page.scss'],
})
export class CodigoUnicoPage implements OnInit {

  validate=true;

  placeholder = "Ingresa tus apellidos";
  mensaje= '';

  form = new FormGroup({
    code: new FormControl('',[Validators.required, Validators.minLength(9), this.match(),Validators.pattern("[0-9]{9}")])
  })

  constructor(
    public dialogRef: MatDialogRef<CodigoUnicoPage>,
    @Inject(MAT_DIALOG_DATA) public infoUser: any,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.infoUser == "") {

    } else {
      this.form.patchValue({ code: this.infoUser });
      this.placeholder=this.infoUser;
    }
  }

  async onClick(){
    try {
      this.validate=false;
      this.mensaje= '';
      const { code } = this.form.value;
      const dat = await this.authService.updateCodigoUnico(code);
        if (dat) {
          this.authService.showUpdatedata();
          this.dialogRef.close();
        }else{
          this.validate=true;
        }
    } catch (error) {
      this.authService.showError(error);
    }
  }

  eraser() {
    this.form.patchValue({ code: "" });
  }


  dimissModal(){
    this.dialogRef.close();
    this.mensaje='';
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.authService.showInfo('No se admite el ingreso de letras');
      return false;
    }
  }

  match() {
    return (control: AbstractControl): { [s: string]: boolean } => {
      if (control.parent) { 
        let data = control.value;
        if (data === this.placeholder) {
          return {
            match: true
          };
        }
      }
      this.mensaje='';
      return null;
    };
  }

}
