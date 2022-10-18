import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { tap, Observable, map } from 'rxjs';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( 
    private http: HttpClient,
    private router: Router
    ) { }

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

    crearHospital( nombre: string ) {
      const url = `${ base_url }/hospitales`;
      return this.http.post(url , { nombre }, this.headers);
    }

    cargarHospitales(): Observable<Hospital[]>{
       
      const url = `${ base_url }/hospitales`;
      return this.http.get<{ ok: boolean, hospitales: Hospital[] }>( url, this.headers )
        .pipe(
          map( (resp: { ok: boolean, hospitales: Hospital[] } ) => resp.hospitales )
        );
      
    }

    actualizarHospital(nombre: string, _id: any) {
      console.log(nombre, _id)
      const url = `${ base_url }/hospitales/${ _id }`;
      console.log('URL: ', url)
      return this.http.put(url , { nombre } , this.headers);
    }

    borrarrHospital( id: string ) {
      const url = `${ base_url }/hospitales/${ id }`;
      return this.http.delete(url , this.headers);   
    }
}
