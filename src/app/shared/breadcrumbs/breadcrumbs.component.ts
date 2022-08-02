import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public title!: string;
  public titleSubs$!: Subscription;

  constructor( private router: Router) {
    this.titleSubs$ = this.getRouteData()
      .subscribe( ( { title } ) => {
        this.title = title;
        document.title = `AdminPro - ${ title }`;
      });
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }

  
  getRouteData(): Observable<any> {
    return  this.router.events
      .pipe(
        filter( (event): event is ActivationEnd => event instanceof ActivationEnd ),
        filter(( event:  ActivationEnd ) => event.snapshot.firstChild === null ),
        map(( event: ActivationEnd ) => event.snapshot.data )
      )
  
  }

}
