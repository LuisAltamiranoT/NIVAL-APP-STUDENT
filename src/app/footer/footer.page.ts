import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins, PluginListenerHandle, NetworkStatus } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';


const { Network } = Plugins;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {

  private stateScanner: Subscription = null;

  networkStatus: NetworkStatus;
  networkListener: PluginListenerHandle;
  //controlar el estado del scanner
  validateScanner:boolean=true;

  constructor(
    private router: Router,
    private authService:AuthService
  ) { }

  async ngOnInit() {
    this.networkListener = Network.addListener('networkStatusChange', status => {
      //console.log('network', status);
      this.networkStatus = status;
    });

    this.stateScanner = this.authService.stateScanner.subscribe((data:any) => {
      this.validateScanner=data.estado;
      //console.log('estado del escaneer',this.validateScanner);
    })

    this.networkStatus = await Network.getStatus();
  }

  ngOnDestroy(): void{
    this.networkListener.remove();
    if(this.stateScanner){
      this.stateScanner.unsubscribe();
    }
  }

  ionViewDidLeave() {
    this.networkListener.remove();
    if(this.stateScanner){
      this.stateScanner.unsubscribe();
    }
  }

  onPerfil() {
    this.router.navigate(['/perfil']);
  }

  onHorario() {
    this.router.navigate(['/perfil']);
  }

}
