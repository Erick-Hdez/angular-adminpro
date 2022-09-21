import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ChildActivationStart } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  @ViewChild('txtTermino') termino: string = '';

  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public totalUsuarios: number = 0;
  public desde: number = 0;
  public cargando: boolean = true;

  public imgSubs!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    public modalImagenService: ModalImagenService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  
  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(800) ).subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe( ( { total , usuarios }  ) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      console.log(this.usuarios)

      this.cargando = false;
    });

  }

  cambiarPagina( valor: number ) {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    console.log(termino);
  
    if ( termino.length === 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.busquedasService.buscar( 'usuarios', termino )
      .subscribe( resultados => {
        console.log(resultados);
        this.usuarios = resultados;
      })
  }

  eliminarUsuario( usuario: Usuario) {
    console.log('borrando usuario', usuario);

    if ( usuario.id === this.usuarioService.uid) {
     
      Swal.fire({
        title: 'Error',
        text: `No puede borrarse a si mismo.`,
        icon: 'error',
      })

      return;

    } 
    

    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario( usuario.id! )
          .subscribe( (resp: any) => {

            Swal.fire(
              `${resp.msg}`,
              `El usuario ${ usuario.nombre } se ha eliminado correctamente`,
              'success'
            )

            this.cargarUsuarios();
          });

      }
    })

  }

  cambiarRole( usuario:Usuario ) {
    console.log(usuario);
    this.usuarioService.actualizarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      })
  }

  cambiarImagen(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal( 'usuarios', usuario.id! , usuario.img );
  }

}
