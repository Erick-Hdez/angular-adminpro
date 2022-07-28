import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';


@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styles: [
  ]
})
export class DoughnutComponent {

    @Input() title: string = 'Sin titulo';

    // Doughnut
    @Input('labels') doughnutChartLabels: string[] = ['Label1', 'Label2', 'Label3'];

    @Input('data') doughnutChartData:  ChartData<'doughnut'> = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data:   [350, 450, 100] },
        { data:   [50, 150, 120]   },
        { data:   [250, 130, 70]  },
      ]
    }
  
    public doughnutChartType: ChartType = 'doughnut';
    
  
    // events
    public chartClicked({ event, active}: {event: ChartEvent, active: {}[] }): void {
      console.log(event, active);
    }
  
    public chartHovered({ event, active}: {event: ChartEvent, active: {}[] }): void {
      console.log(event, active);
    }


}
