import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  @Input('progressValue') progress: number = 50;
  @Input() btnClass: string = 'btn-primary';

  @Output() value: EventEmitter<number> = new EventEmitter();


  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  changeProgress( value: number ) {

    if ( this.progress <= 0 && value < 0 ) {
      this.value.emit(0)
      return this.progress = 0; 
    }

    if (this.progress >= 100 && value >= 0) {
      this.value.emit(100)
      return this.progress = 100;
    }

    this.value.emit(this.progress + value);
    return this.progress = this.progress + value;
  }

  onChange( newValue: number) {
    
    if (newValue >= 100) {
      this.progress = 100;
      return this.value.emit(this.progress);
    }

    if (newValue <= 0) {
      this.progress = 0;
      return this.value.emit(this.progress);
    }

    this.progress = newValue;
    this.value.emit(this.progress);
  }

}
