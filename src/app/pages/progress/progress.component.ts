import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css' ]
})
export class ProgressComponent {

  progressOne: number = 25;
  progressTwo: number = 35;

  get progressPercentageOne(): string {
    return `${this.progressOne}%`;
  }
  get progressPercentageTwo(): string {
    return `${this.progressTwo}%`;
  }

  // catchProgressOne( value: number ){
  //   console.log(value)
  //   this.progressOne = value;
  // }

  // catchProgressTwo( value: number ){
  //   console.log(value)
  //   this.progressTwo = value;
  // }


}
