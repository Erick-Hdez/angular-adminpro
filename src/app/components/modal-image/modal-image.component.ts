import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent implements OnInit {

  public imagenUsuario!: File;
  public imgTemporal!: any;
  public usuario!: Usuario;

  constructor( 
    public modalImagenService: ModalImagenService,
    private fileUpload: FileUploadService
  ) { }

  ngOnInit(): void {
    
  }

  cambiarImagen( event: any ) {
    const imagen: File = event.target.files[0];
    console.log(imagen);
    this.imagenUsuario = imagen;

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
    
    const tipo = this.modalImagenService.tipo;
    const uid = this.modalImagenService.id || '';

    console.log(uid)
    console.log(this.imagenUsuario)

    this.fileUpload
      .actualizarFoto(this.imagenUsuario, tipo , uid )
      .then( img => {

        Swal.fire({
          title: 'Guardado',
          text: `La imagen ha sido actualizada`,
          icon: 'success',
        })

        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();

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

  cerrarModal() {
    this.imgTemporal = null;
    this.modalImagenService.cerrarModal();
  }
}
