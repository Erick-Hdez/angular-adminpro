import { Component } from '@angular/core';
import { ChartData } from 'chart.js';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  // Doughnut
  public chartLabels: string[] = [ 'Carne', 'Tortillas', 'Refresco' ];
  public chartData:  ChartData<'doughnut'> = {
    labels: this.chartLabels,
    datasets: [
      { data:   [350, 450, 100],
        backgroundColor: ['#6857E6','#009FEE','#F02059'],
        hoverBackgroundColor: ['#6857E6','#009FEE','#F02059'],
        hoverBorderColor:['#000000','#000000','#00000003'] }
    ]
  }
  
  

}
