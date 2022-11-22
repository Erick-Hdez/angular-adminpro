import { Medico } from 'src/app/models/medico.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios!: Usuario[];
  public medicos!: Medico[];
  public hospitales!: Hospital[];

  constructor( 
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ termino }) => {  
      console.log(termino);
      this.busquedaGlobal(termino);
    });

  }

  busquedaGlobal( termino: string ) {

    if (termino.trim().length <= 0 ) {
      return;
    }

    this.busquedasService.busquedaGlobal( termino )
    .subscribe( ({ hospitales, medicos, usuarios }) => {
          this.usuarios = usuarios;
          this.hospitales = hospitales;
          this.medicos = medicos;
    });
  }

  abrirUsuario(usuario: Usuario) {
    this.busquedasService.setUsuario = usuario.nombre;
    this.router.navigateByUrl(`/dashboard/usuarios`);
  }
  
  abrirMedico(medico: Medico) {
    this.router.navigateByUrl(`/dashboard/medico/${ medico.id }`);
  }
  
  abrirHospital(hospital: Hospital) {
    this.busquedasService.setHospital = hospital.nombre;
    this.router.navigateByUrl(`/dashboard/hospitales`);
  }

}
