import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.page.html',
  styleUrls: ['./view-image.page.scss'],
})
export class ViewImagePage implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewImagePage>,
    @Inject(MAT_DIALOG_DATA) public infoUser: any
  ) { }

  ngOnInit(): void {
  }

}
