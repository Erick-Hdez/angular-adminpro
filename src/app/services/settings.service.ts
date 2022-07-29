import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
  private linkTheme = document.querySelector('#theme');
  private url: string = localStorage.getItem('theme') || `./assets/css/colors/default-dark.css`;

  constructor() {
    console.log('Settings Service Init')
    this.linkTheme?.setAttribute('href', this.url!);
   }

   
  changeTheme( theme: string ) {
    
    const url = `./assets/css/colors/${ theme }.css`; 
    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();

  }
 
  checkCurrentTheme() {
    const themeLinks = document.querySelectorAll('.selector');
    themeLinks.forEach(element => {
      element.classList.remove('working');
      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl =  `./assets/css/colors/${ btnTheme }.css`; 
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        element.classList.add('working');
      }
    })
  }
 
}
