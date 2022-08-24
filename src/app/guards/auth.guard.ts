import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      
    console.log('Paso por el CanActivate del guard')  
    return this.usuarioService.validarToken()
      .pipe( 
        tap( isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
}
