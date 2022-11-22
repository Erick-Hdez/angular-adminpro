import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }
  
  public usuario$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public hospital$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  
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

  get usuario() {
    return this.usuario$.asObservable();
  }
  
  set setUsuario( usuario: string ) {
    this.usuario$.next(usuario);
  }

  get hospital() {
    return this.hospital$.asObservable();
  }

  set setHospital( hospital: string ) {
    this.hospital$.next(hospital);
  }

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

  private transformarHospitales( resultados: any[] ): Hospital[] {
    return resultados;
  }

  private transformarMedicos( resultados: any[] ): any[] {
    return resultados;
  }

  busquedaGlobal( termino: string ) {
    const url = `${ base_url }/todo/${ termino }`;
    return this.http.get<any>(url, this.headers);
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
              return this.transformarMedicos( resp.resultados );
            break;
            case 'hospitales':
              return this.transformarHospitales( resp.resultados );
            break;
            default:
              return [];
          }
        })
      );
  }

}
