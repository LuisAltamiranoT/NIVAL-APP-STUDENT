import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire'

import { environment } from 'src/environments/environment'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterPage } from './footer/footer.page';
import { NavbarPage } from './navbar/navbar.page';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './shared/auth.guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgFallimgModule } from 'ng-fallimg';


@NgModule({
  declarations: [
    AppComponent,
    FooterPage,
    NavbarPage],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    NgFallimgModule.forRoot({
      default:'assets/icon/withoutUser.jpg',
      perfil:'assets/icon/withoutUser.jpg',
      curso:'assets/icon/clase.jpg',
    }),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AuthGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
