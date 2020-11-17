import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public location: Location
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

    //permite remover el navbar de algunas direcciones
    remove() {
      let title = this.location.prepareExternalUrl(this.location.path());
      title = title.slice(1).split("/")[0];
      if (title === "home" || title === "login" || title === "register" || title === "send-email-component" || title === "forgot-password") {
        return true;
      } else {
        return false;
      }
    }
  
    removeFooter() {
      let title = this.location.prepareExternalUrl(this.location.path());
      title = title.slice(1).split("/")[0];
      if (title === "home" || title === "login" || title === "register" || title === "send-email-component" || title === "forgot-password" ) {
        return true;
      } else {
        return false;
      }
    }
}
