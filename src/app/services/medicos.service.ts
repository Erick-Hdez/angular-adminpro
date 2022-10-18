import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Medico } from '../models/medico.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos(): Observable<Medico[]> {
    const url = `${ base_url }/medicos`;
    return this.http.get<{ok: boolean, medicos: Medico[]}>( url, this.headers )
      .pipe(
        map( (resp: {ok: boolean, medicos: Medico[]}) => resp.medicos)
      );
  }

  crearMedico( medico: Medico ) {
    const url = `${base_url}/medicos`
    return this.http.post< { ok: boolean, medico: Medico } >( url, medico, this.headers )
      .pipe(
        map( (resp: {ok: boolean, medico: Medico}) => resp.medico)
      );
  }

  obtenerMedicoPorId( id: string ) {
    const url = `${base_url}/medicos/${ id }`
    return this.http.get< { ok: boolean, medico: Medico } >( url, this.headers )
      .pipe(
        map( (resp: {ok: boolean, medico: Medico}) => resp.medico)
      );
  }

  actualizarMedico(medico: any) {
    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.put<{ ok: boolean, medico: Medico }>( url , medico , this.headers)
      .pipe(
        map( (resp: {ok: boolean, medico: Medico}) => resp.medico)
      );
  }

  borrarrMedico( id: string ) {
    const url = `${ base_url }/medicos/${ id }`;
    return this.http.delete(url , this.headers);   
  }
}
