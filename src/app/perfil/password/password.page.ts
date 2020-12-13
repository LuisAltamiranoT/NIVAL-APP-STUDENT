import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  validacionPass: boolean = false;
  validate = true;
  mensaje = '';

  hide = true;
  hide1 = true;
  hide2 = true;

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.matchPass('oldPassword')]),
    rePassword: new FormControl('', [Validators.required, Validators.minLength(6), this.match('newPassword')]),
  })

  constructor(
    public dialogRef: MatDialogRef<PasswordPage>,
    @Inject(MAT_DIALOG_DATA) public infoUser: any,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  async onClick() {
    this.validate = false;
    const { oldPassword, newPassword, rePassword } = this.passwordForm.value;
    const dat = await this.authService.updatePass(oldPassword, newPassword);
    if (dat != 1) {
      this.validate = true;
    } else {
      this.dimissModal();
      this.authService.showSuccess("Su contraseña ha sido actualizada");
    }
  }


  dimissModal() {
    this.dialogRef.close();
  }

  match(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      if (control.parent) {
        const checkValue = control.parent.controls[controlKey].value;
        if (control.value !== checkValue) {
          this.validacionPass = false;
          return {
            match: true
          };
        }
      }
      this.validacionPass = true;
      return null;
    };
  }

  //validar dos nombres
  matchPass(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      if (control.parent) {
        let data = control.value;
        const value = control.parent.controls[controlKey].value;
        //console.log(value);
        if (data === value && value!=="") {
          this.mensaje = 'La nueva contraseña es igual a la anterior';
          return {
            match: true
          };
        }
        this.validacionPass = true;
        this.mensaje = '';
        return null;
      }
    };
  }
}
