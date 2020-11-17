import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-send-email-component',
  templateUrl: './send-email-component.page.html',
  styleUrls: ['./send-email-component.page.scss'],
})
export class SendEmailComponentPage implements OnDestroy {

  public user$:Observable<any>=this.authService.afAuth.user;

  constructor(
    private authService:AuthService
  ) { }

  ngOnDestroy(){
    this.authService.logout();
  }

  onSendEmail():void{
    this.authService.sendVerificationEmail();
  }

}
