import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins, PluginListenerHandle, NetworkStatus } from '@capacitor/core';


const { Network } = Plugins;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {

  networkStatus: NetworkStatus;
  networkListener: PluginListenerHandle;

  constructor(
    private router: Router
  ) { }

  async ngOnInit() {
    this.networkListener = Network.addListener('networkStatusChange', status => {
      console.log('network', status);
      this.networkStatus = status;
    });
    this.networkStatus = await Network.getStatus();

  }

  ngOnDestroy(): void{
    this.networkListener.remove();
  }

  onPerfil() {
    this.router.navigate(['/perfil']);
  }

  onHorario() {
    this.router.navigate(['/perfil']);
  }

}
