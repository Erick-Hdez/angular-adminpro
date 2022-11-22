import { Component, OnInit, OnDestroy } from '@angular/core';

import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import Swal from 'sweetalert2';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales!: Hospital[];
  public hospital!: string;
  public cargando: boolean = true;
  public  imgSubs!: Subscription;
  constructor(
    private hospitalService: HospitalService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.busquedasService.hospital
      .subscribe( hospital => {
        this.hospital = hospital;
        console.log(this.hospital);
      }).unsubscribe();

    if ( this.hospital ) {
      this.buscar( this.hospital );
    }
    else {
      this.cargarHospitales();
    }

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(800) )
      .subscribe( img => this.cargarHospitales() );
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        console.log(hospitales);
        this.hospitales = hospitales
        this.cargando = false;
      });
  }

  cambiarImagen(hospital: Hospital) {
    this.modalImagenService.abrirModal( 'hospitales', String(hospital.id) , hospital.img );
  }

  buscar( termino: string ) {
    console.log(termino);

    if( termino.length === 0 ) {
      return this.cargarHospitales();
    }

    this.busquedasService.buscar( 'hospitales', termino ) 
      .subscribe( (resultados: Hospital[]) => {
        console.log(resultados);
        this.hospitales = resultados;
        this.cargando = false;
      }); 
  }

  guardarCambios(hospital: Hospital) {

    this.hospitalService.actualizarHospital( hospital.nombre , hospital.id) 
      .subscribe(resp => {
        console.log( resp )
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Hospital Actualizado',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Borrar Hospital?',
      text: `Esta a punto de borrar: ${ hospital.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.hospitalService.borrarrHospital( String(hospital.id!) )
          .subscribe( (resp: any) => {

            Swal.fire(
              `${resp.msg}`,
              `El hospital ${ hospital.nombre } se ha eliminado correctamente`,
              'success'
            )

            this.cargarHospitales();
          });
      }
    })  
  }

  async crearHospital() {
    const { value } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      // inputLabel: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    });
    console.log(value);

    if ( value?.trim().length! > 0) {
      this.hospitalService.crearHospital( value! )
        .subscribe( (resp: any) => {
          console.log(resp);
          // this.cargarHospitales();
          this.hospitales.push(resp.hospital);
        });
    }

  }

  
  

}
