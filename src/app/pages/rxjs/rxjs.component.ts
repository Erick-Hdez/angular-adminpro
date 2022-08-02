import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, interval, map, Observable, retry, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervaloInfinitoSubs: Subscription;

  constructor() { 
   
    this.intervaloInfinitoSubs = this.retornaIntervaloInfinito().subscribe(console.log);

    this.retornaIntervalo()
      .subscribe( console.log );
    // // El pipe es un methodo que permite transformar la informacion que fluye a traves de el observable
    // this.retornaObservable().pipe(
    //     // el metodo retry() va a intentar el proceso cuantas veces sea necesario 
    //     retry(2)
    //   )
    //   .subscribe({
    //     // El subscriber es el que ve el estado del observable y la data que fluye a traves de el 
    //     next: valor => console.log('Subs: ', valor),
    //     error: error => console.warn(error),
    //     complete: () => console.info('Observable ha terminado!!!')
    //   });

  }
  ngOnDestroy(): void {
    this.intervaloInfinitoSubs.unsubscribe();
  }

  ngOnInit(): void {
  }

  retornaIntervalo(): Observable<number> {
    return interval(200).pipe(
      // El metodo take devuelve el valor numerico emitido por el observable
      take(10),
      // El metodo map transforma la data 
      map(valor => valor + 1),
      filter( valor => ( valor % 2 !== 0 ) ? true : false)
    );
    
  }

  retornaIntervaloInfinito(): Observable<number> {
    return interval(200).pipe(
      // El metodo map transforma la data 
      map(valor => valor + 1),
    );
    
  }


  retornaObservable(): Observable<number> {

    let i = -1;

    // El observer es el que emite los valores (cunado se termina, cuando error)
    return new Observable<number>( observer => {    
      const interval = setInterval( () => {

        i++;
        // next emite el siguiente valor
        observer.next( i );

        if ( i === 4) {
          // metodo anonimo de setInterval del ES6 para cancelar un interval
          clearInterval( interval );

          // el complete termina el observable y emite un estado de fin
          observer.complete();
        }

        if ( i === 2) {
          // error emite un mensaje de error
          observer.error('i llego al valor de 2');
        }

      }, 1000)
    });
  } 

}
