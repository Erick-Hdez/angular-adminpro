import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { MedicosService } from '../../../services/medicos.service';
import { FileUploadService } from '../../../services/file-upload.service';

import { Medico } from '../../../models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { _HospitalUsuario } from '../../../models/hospital.model';



@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  public medico!: Medico;
  public medicoSeleccionado!: Medico; 
  public imageMedico!: File;
  public imgTemporal!: any;

  constructor(
    private formBuilder: FormBuilder,
    private medicoService: MedicosService,
    private hospitaService: HospitalService,
    private fileUpload: FileUploadService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activateRoute.params.subscribe( ({ id }) => this.cargarMedico( id ));
      
    this.cargarHospitales();

    this.medicoForm = this.formBuilder.group({
      nombre: [ this.medicoSeleccionado? this.medicoSeleccionado.nombre: '', Validators.required ],
      hospital: [  this.hospitalSeleccionado? this.hospitalSeleccionado.nombre: '', Validators.required ],
    });

    this.medicoForm.get('hospital')?.valueChanges.subscribe(
      ( hospitalId ) => this.hospitalSeleccionado = this.hospitales.find( h => h.id === hospitalId));
  }

  cargarMedico( id: string ) {
    if ( id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
      .pipe(
        delay(100)
      )
      .subscribe( (medico: any) => {        
        this.medicoSeleccionado = medico;
        this.hospitalSeleccionado = this.medicoSeleccionado.hospital;
        const { nombre, hospital: {_id}} = medico;
        this.medicoForm.setValue({
          nombre,
          hospital: _id
        })
      })
  }

  cargarHospitales() {
    this.hospitaService.cargarHospitales()  
      .subscribe( (resp:Hospital[]) => {
        this.hospitales = resp;         
      })
  }

  guardarMedico() {
    if( !this.medicoForm.valid ) {
      return;
    };

    if (this.medicoSeleccionado) {
      // Actualizar Medico
     this.actualizarMedico();
    } else {
      // Crear Medico
      this.medicoService.crearMedico(this.medicoForm.value)
      .subscribe({
        next: (  medico: Medico ) => {
         (medico);
          Swal.fire({
            title: 'Guardado',
            text: `Médico ${ medico.nombre } creado exitosamente`,
            icon: 'success',
          })
          this.router.navigateByUrl(`/dashboard/medico/${ medico.id }`);
        },
        error: (err)=> {
          console.warn(err);
          Swal.fire({
            title: 'Error',
            text: `${ err.error.msg }`,
            icon: 'error',
          })
        }
      });    
    }
  }

  actualizarMedico() {
    const data: Medico = {
      ...this.medicoForm.value,
      _id: this.medicoSeleccionado.id
    };
    
    this.medicoService.actualizarMedico( data )
      .subscribe({
        next: (medico: Medico) => {
          Swal.fire({
            title: 'Actualizado',
            text: `Médico ${ medico.nombre } actualizado exitosamente`,
            icon: 'success',
          })},

        error: (err) => {
          console.warn(err)
          Swal.fire({
            title: 'Error',
            text: `${ err.error.msg }`,
            icon: 'error',
          })}
      });
  }

  cambiarImagen( event : any ) {
    const imagen: File = event.target.files[0]
    this.imageMedico = imagen;

    if ( !imagen ) { 
      this.imgTemporal = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( imagen );
    reader.onloadend = () => {
      this.imgTemporal = reader.result;
    }

  }

  actualizarFoto() {
    const uid = this.medico.id || '';

    this.fileUpload
      .actualizarFoto(this.imageMedico, 'medicos', uid )
      .then( img => {
        this.medico.img = img 
        Swal.fire({
          title: 'Guardado',
          text: `La imagen ha sido actualizada`,
          icon: 'success',
        })
      })
      .catch( err => {

        console.warn(err)
        Swal.fire({
          title: 'Error',
          text: `${ err.error.msg }`,
          icon: 'error',
        })
      })
  }


}
