import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
 styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmited: boolean = false;

  public registerForm: FormGroup = this.formBuilder.group({
    nombre: ['Erick', [ Validators.required, Validators.minLength(3) ]],
    email: ['erick@test.com', [ Validators.required, Validators.email ]],
    password: ['123456',  [Validators.required, Validators.minLength(6)]],
    password2: ['1234567',  [Validators.required, Validators.minLength(6)]],
    terminos: [false,  [Validators.required]]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( 
      private formBuilder: FormBuilder,
      private usuarioService: UsuarioService,
      private router: Router
    ) { }

  ngOnInit(): void {
  }

  campoNoValido( campo: string ): boolean {

    if (this.registerForm.get(campo)?.invalid && this.formSubmited ) {
      return true;
    } else {
      return false;
    }
  }

  aceptarTerminos(): boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmited;  
  }

  contrasenasNoValidas(): boolean {
     const pass1 = this.registerForm.get('password')?.value;
     const pass2 = this.registerForm.get('password2')?.value;

     if (pass1 !== pass2 && this.formSubmited) {
      return true;
     } else {
      return false;
     }

  }

  passwordsIguales( pass1: string, pass2: string) {
    return (  formGroup:FormGroup ) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if ( pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    }
  }

  crearUsuario() {
    this.formSubmited = true;
    console.log( this.registerForm.value );

    if ( this.registerForm.invalid ) return;  

    // Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
      .subscribe({
        next: resp => {
          console.log('Usuario creado');
          console.log( resp );

          // Navegar al dashboard
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.warn(err)
          Swal.fire({
            title: 'Error',
            text: `${ err.error.msg }`,
            icon: 'error',     
          })
        }
      });
  }

}
