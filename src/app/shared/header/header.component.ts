import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario!: Usuario;


  constructor( 
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { 
    
    this.usuario = this.usuarioService.usuario;

  }

  ngOnInit(): void {
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar( termino: string ) {
    if (termino.length === 0) {
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
  }

}
