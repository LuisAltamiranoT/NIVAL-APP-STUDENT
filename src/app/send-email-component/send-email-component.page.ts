import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-send-email-component',
  templateUrl: './send-email-component.page.html',
  styleUrls: ['./send-email-component.page.scss'],
})
export class SendEmailComponentPage implements OnDestroy {

  public user$: Observable<any> = this.authService.afAuth.user;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnDestroy() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  ionViewDidLeave() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }


  onSendEmail(): void {
    this.authService.sendVerificationEmail();
  }

}
