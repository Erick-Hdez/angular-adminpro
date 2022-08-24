import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { tap, map, Observable, catchError, of } from 'rxjs';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( 
    private http: HttpClient,
    private router: Router
  ) { }

  logout() {
    localStorage.removeItem('token');
    
    // Remover la sesion de google 
    google.accounts.id.revoke('correo', () => {

      this.router.navigateByUrl('/login');

    })
  }

  validarToken(): Observable<boolean> {
    
    const token = localStorage.getItem('token') || '';
    const url = `${ base_url }/login/renew`;

    return this.http.get( url , {
        headers:{ 
          'x-token': token
        }
      })
      .pipe(
        tap( ( resp:any ) => {
          localStorage.setItem('token', resp.token);
        }),
        map(() => true), // Transformando la respuesta del Observable por un valor booleano
        catchError(error => of(false)) // Regresa Observable de false (no logro hacer la utenticacion)
      );
  }

  crearUsuario( formData: RegisterForm ) {
    const url = `${ base_url }/usuarios`
    return this.http.post( url, formData )
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.usuario.token);
        })
      );          
  }

  loginUsuario( formData: LoginForm ) {
    const url = `${ base_url }/login`;
    return this.http.post( url, formData )
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );                 
  }

  loginGoogle( token: string ) {
    const url = `${ base_url }/login/google`;
    return this.http.post( url, { token } )
      .pipe(
        tap( ( resp:any ) => {
          localStorage.setItem('token', resp.tokenDB);
        })
      );
  }
}
