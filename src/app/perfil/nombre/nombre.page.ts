import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-nombre',
  templateUrl: './nombre.page.html',
  styleUrls: ['./nombre.page.scss'],
})
export class NombrePage implements OnInit {

  validate=true;
  placeholder = "Ingresa tus nombres";
  mensaje= '';

  nombreForm = new FormGroup({
    name: new FormControl('',[Validators.required, Validators.minLength(4),this.match()])
  })

  constructor(
    public dialogRef: MatDialogRef<NombrePage>,
    @Inject(MAT_DIALOG_DATA) public infoUser: any,
    private authService:AuthService
  ) { }

  ngOnInit() {
    //console.log(this.infoUser);

    if (this.infoUser == "") {

    } else {
      this.nombreForm.patchValue({ name: this.infoUser });
      this.placeholder = this.infoUser;
    }
  }

  async onClick() {
    try {
      this.validate = false;
      this.mensaje= '';
      const { name } = this.nombreForm.value;
      const dat = await this.authService.updateName(name);
        if (dat) {
          this.authService.showUpdatedata();
          this.dialogRef.close();
        }else{
          this.validate = true;
        }
    } catch (error) {
      this.authService.showError(error);
    }
  }
  
  
  dimissModal() {
    this.dialogRef.close();
    this.mensaje='';
  }

  eraser() {
    this.nombreForm.patchValue({ name: "" });
  }
  
//validar dos nombres
  match() {
    return (control: AbstractControl): { [s: string]: boolean } => {
      if (control.parent) { 
        let data = control.value.split(' ');
        let long = data.length;
        //console.log(data);
        //console.log(long)
        if (long > 2) {
          this.mensaje='Solo puede ingresar dos nombres';
          return {
            match: true
          };
        }else if (data[0]+' '+data[1] === this.placeholder) {
          return {
            match: true
          };
        }else if (data[0]==="") {
          this.mensaje='No use espacios al inicio del primer nombre';
          return {
            match: true
          };
        }else if (data[1]==="" || data[1]===undefined) {
          this.mensaje='Debe ingresar dos nombres';
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
