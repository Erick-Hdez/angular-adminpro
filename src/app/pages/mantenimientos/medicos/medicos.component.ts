import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { delay, Subscription } from 'rxjs';
import { MedicosService } from '../../../services/medicos.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos!: Medico[];
  public cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(
    private medicosService: MedicosService, 
    private busquedasService: BusquedasService, 
    private modalImagenService: ModalImagenService, 
    private route: Router
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(800) ).subscribe( img => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos()
      .subscribe( (resp: Medico[]) => {
        this.medicos = resp;
        this.cargando = false;
      })
  }


  buscar( termino: string ) {
    console.log(termino);

    if( termino.length === 0 ) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino ) 
      .subscribe( (resultados: Medico[]) => {
        console.log(resultados);
        this.medicos = resultados;
      }); 
  }

  cambiarImagen(medico: Medico) {
    this.modalImagenService.abrirModal( 'medicos', String(medico.id) , medico.img );
  }

  guardarCambios( medico: Medico ) {

    this.medicosService.actualizarMedico( medico ) 
      .subscribe(resp => {
        console.log( resp )
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Medico Actualizado',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: '¿Borrar Medico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicosService.borrarrMedico( String(medico.id!) )
          .subscribe( (resp: any) => {

            Swal.fire(
              `${resp.msg}`,
              `Medico ${ medico.nombre } fue eliminado correctamente`,
              'success'
            )

            this.cargarMedicos();
          });
      }
    })  
  }

  async crearMedico() {
    this.route.navigateByUrl('/dashboard/medico/nuevo');
  }

}
