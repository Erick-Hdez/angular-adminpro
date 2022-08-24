import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef<any>;
  
  public formSubmited: boolean = false;

  public loginForm: FormGroup = this.formBuilder.group({
    email: [ localStorage.getItem('email') || '' , [ Validators.required, Validators.email ]],
    password: ['',  [ Validators.required ]], 
    remember: [false]
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) { }

    
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    // console.log({esto: this});
    google.accounts.id.initialize({
      client_id: "391404186964-rrm5fhkkkv9ab9pdh7mbqs7gffmd9h9l.apps.googleusercontent.com",
      callback: ( response: any ) => this.handleCredentialResponse( response )
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    console.log({esto: this});
    console.log(response)
    console.log("Encoded JWT ID token: " + response.credential);

    this.usuarioService.loginGoogle( response.credential )
    .subscribe({
      next: resp => {
        console.log('Inicio de sesion exitoso');

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
    })
  }

  login() {
    console.log('submit')
    console.log(this.loginForm.value);

    if ( this.loginForm.invalid ) return;

    // Realizar el posteo

    this.usuarioService.loginUsuario( this.loginForm.value )
      .subscribe({
        next: resp => {
          console.log('Inicio de sesion exitoso');

          if ( this.loginForm.get('remember')?.value ) {
            localStorage.setItem('email', this.loginForm.get('email')?.value);
          } else {
            localStorage.removeItem('email');
          }

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
      })
  }

}
