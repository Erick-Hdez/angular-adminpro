import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  private transformarUsuarios( resultados: any[] ): Usuario[] {
    return resultados.map( 
      (user: Usuario) => new Usuario( user.nombre, 
          user.email, 
          '',
          user.google,
          user.img,
          user.role, 
          user.id 
       ));
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers:{ 
        'x-token': this.token
      }
    };
  }

  buscar( 
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string
  ) {

    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( ( resp: any ) => {

          switch( tipo ) {
            case 'usuarios':
              return this.transformarUsuarios( resp.resultados );
            break;
            case 'medicos':
              return this.transformarUsuarios( resp.resultados );
            break;
            case 'hospitales':
              return this.transformarUsuarios( resp.resultados );
            break;
            default:
              return [];
          }
        })
      );

  }

}
