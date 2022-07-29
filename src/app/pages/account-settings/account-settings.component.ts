import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {
  
  constructor(private settigsService: SettingsService) { }

  ngOnInit(): void {
    this.settigsService.checkCurrentTheme();
  }

  changeTheme( theme: string ) {
    this.settigsService.changeTheme(theme); 
  } 

}
