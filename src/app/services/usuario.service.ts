import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { tap, map, Observable, catchError, of } from 'rxjs';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';


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

  get role(): 'USER_ROLE' | 'ADMIN_ROLE' {
    return this.usuario.role!;
  }

  get headers() {
    return {
      headers:{ 
        'x-token': this.token
      }
    };
  }

  guardarLocalStorage( token: string, menu: any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify( menu ));
  }

  logout() {
    // Borrar el token 
    localStorage.removeItem('token');
    // Borrar menu
    localStorage.removeItem('menu');

    // Remover la sesion de google 
    // google.accounts.id.revoke('correo', () => {

      this.router.navigateByUrl('/login');

    // })
  }

  validarToken(): Observable<boolean> {
    
    const url = `${ base_url }/login/renew`;
    return this.http.get( url , this.headers )
      .pipe(
        // tap( ( resp:any ) => {
        map( ( resp:any ) => {

          const {nombre, email, role, img = '', google, id } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '',  google, img, role, id);

          this.guardarLocalStorage( resp.token, resp.menu );

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
        tap( (resp: any) => this.guardarLocalStorage( resp.token, resp.menu ))
      );          
  }

  loginUsuario( formData: LoginForm ) {

    const url = `${ base_url }/login`;
    return this.http.post( url, formData )
      .pipe(
        tap( (resp: any) => this.guardarLocalStorage( resp.token, resp.menu ))
      );                 
  }

  loginGoogle( token: string ) {
    
    const url = `${ base_url }/login/google`;
    return this.http.post( url, { token } )
      .pipe(
        tap( ( resp:any ) => this.guardarLocalStorage( resp.token, resp.menu ))
      );

    // return new Promise( resolve => {
    //   gapi.load('auth2', () => {
    //     this.auth2 = gapi.auth2.init({
    //       client_id:'',
    //       cookiepolicy: 'single_host_origin',
    //     });

    //     resolve();
    //   });
    // })
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string }) {

    data = {
      ...data, 
      role: this.usuario.role || ''
    }

    const url = `${ base_url }/usuarios/${ this.uid }`;
    return this.http.put(url, data, this.headers );
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
      .pipe(
        map( resp => {

          const usuarios = resp.usuarios
            .map( user => new Usuario( 
              user.nombre, user.email, '', user.google, user.img, user.role, user.id )
            );

          return {
            total: resp.total,
            usuarios
          };

        })
      );
  }

  eliminarUsuario(id: string ) {
    const url = `${ base_url }/usuarios/${ id }`;
    return this.http.delete( url, this.headers );
  }

  actualizarUsuario( usuario: Usuario) {
    const url = `${ base_url }/usuarios/${ usuario.id }`;
    return this.http.put(url, usuario, this.headers );
  }
}
