import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private menu: any[] = [
    { 
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        {title: 'Principal', url: '/'},
        {title: 'ProgressBar', url: 'progress'},
        {title: 'Promesas', url: 'promesas'},
        {title: 'Graficas', url: 'grafica1'},
        {title: 'RxJs', url: 'rxjs'},
      ]
    }
  ];

  constructor() { }

  getMenu() {
    return this.menu;
  }
}
