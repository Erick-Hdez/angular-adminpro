import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { tap, map, Observable, catchError, of } from 'rxjs';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor( 
    private http: HttpClient,
    private router: Router
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.id || '';
  }

  logout() {
    localStorage.removeItem('token');
    
    // Remover la sesion de google 
    // google.accounts.id.revoke('correo', () => {

      this.router.navigateByUrl('/login');

    // })
  }

  validarToken(): Observable<boolean> {
    
    const url = `${ base_url }/login/renew`;

    return this.http.get( url , {
        headers:{ 
          'x-token': this.token
        }
      })
      .pipe(
        // tap( ( resp:any ) => {
        map( ( resp:any ) => {

          const {nombre, email, role, img = '', google, id } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '',  google, img, role, id);

          localStorage.setItem('token', resp.token);
          console.log(this.usuario);
          return true;
          
        }),
        // map(() => true), // Transformando la respuesta del Observable por un valor booleano
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

  actualizarPerfil( data: { email: string, nombre: string, role: string }) {

    data = {
      ...data, 
      role: this.usuario.role || ''
    }
    const url = `${ base_url }/usuarios/${ this.uid }`;

    return this.http.put(url, data, {
      headers:{ 
        'x-token': this.token
      }
    });

  }
}
