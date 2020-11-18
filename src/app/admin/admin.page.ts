import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  validate:boolean=true;
  width=20;
  imgProfesor= 'https://material.angular.io/assets/img/examples/shiba1.jpg';
 

  constructor() { }

  ngOnInit() {
  }

  click(){
    console.log('vale');
  }

}
