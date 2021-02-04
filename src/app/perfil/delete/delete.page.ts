import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-delete',
  templateUrl: './delete.page.html',
  styleUrls: ['./delete.page.scss'],
})
export class DeletePage implements OnInit {

  validacionPass: boolean = false;
  validate = true;
  mensaje = '';

  hide = true;
  hide1 = true;
  hide2 = true;

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  constructor(
    public dialogRef: MatDialogRef<DeletePage>,
    @Inject(MAT_DIALOG_DATA) public infoUser: any,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  async onClick() {
    this.validate = false;
    const { oldPassword } = this.passwordForm.value;
    const dat = await this.authService.updateAcoountUser(oldPassword,this.infoUser);
    if (dat != 1) {
      this.validate = true;
    } else {
      this.dimissModal();
      this.router.navigate(['/home']);
    }
  }

  dimissModal() {
    this.dialogRef.close();
  }

  eraser() {
    this.passwordForm.patchValue({ office: "" });
  }

  //https://firebasestorage.googleapis.com/v0/b/easyacnival.appspot.com/o/imageCurso%2FwithoutUser.jpg?alt=media&token=61ba721c-b7c1-42eb-8712-829f4c465680

}
