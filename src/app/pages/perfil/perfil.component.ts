import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import Swal  from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imageUsuario!: File;
  public imgTemporal!: any;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUpload: FileUploadService
    ) {

      this.usuario = usuarioService.usuario;

    }

  ngOnInit(): void {

    this.perfilForm = this.formBuilder.group({
      nombre: [ this.usuario.nombre, Validators.required ],
      email: [ this.usuario.email, [ Validators.required, Validators.email ] ]
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( () => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire({
          title: 'Guardado',
          text: `Cambios fueron guardados`,
          icon: 'success',
        })

      }, (err) => {
        console.warn(err)
        Swal.fire({
          title: 'Error',
          text: `${ err.error.msg }`,
          icon: 'error',
        })
      });
  }

  cambiarImagen( event : any ) {
    const imagen: File = event.target.files[0]
    console.log(imagen);
    this.imageUsuario = imagen;

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
    
    const uid = this.usuario.id || '';

    this.fileUpload
      .actualizarFoto(this.imageUsuario, 'usuarios', uid )
      .then( img => {

        this.usuario.img = img 

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
