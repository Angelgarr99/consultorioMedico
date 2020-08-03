import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private usuarioServicio: UsuarioService, private fb: FormBuilder) { 
    this.crearFormulario();
  }
  usuarios: UsuarioModel[] = [];
  forma: FormGroup;
  ngOnInit(): void {
    this.usuarioServicio.logout();
    this.usuarioServicio.getUsuario('-MDpQquNFt8i26P_Wv80').subscribe((resp: UsuarioModel) => {
      if(!resp.nombre){
        Swal.fire({
          title: 'Ing. Ivan',
          text: `porfavor de click en OK para ser redireccionado y poder crear su usuario con rol de Doctor(Administrador)`,
          icon: 'info',
          showConfirmButton: true,
          showCancelButton: true
        }).then( resp => {
          if( resp.value ){
            this.esIngIvan();
          }
        });

      }
    });
    	
  }
  esIngIvan(){
    return this.router.navigate(['/usuario/doctorNuevo/-MDpQquNFt8i26P_Wv80']);
  }

  get usuarioNoValido(){
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched;
  }
  get contrasenaNoValido(){
    return this.forma.get('contrasena').invalid && this.forma.get('contrasena').touched;
  }
  crearFormulario(){
    this.forma = this.fb.group({
      usuario        : ['', [Validators.required]],
      contrasena     : ['', Validators.required ],
    });
  }


  login(){
    Swal.fire({
      title: 'Espere',
      text: 'Validando Usuario',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    if (this.forma.invalid){
      return Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach( control2 => control2.markAllAsTouched());
        }else{
          control.markAllAsTouched();
          Swal.fire({
            title: 'Error',
            text: ` faltan campos necesarios`,
            icon: 'error'
          });
        }
      });
      // alert
    }

    const aux = this.forma.value;
    const usuario = aux.usuario;
    const pass = aux.contrasena;

    this.usuarioServicio.login(usuario, pass).subscribe (resp => {
      const _us: UsuarioModel[] = resp;
      if ( resp !== null){
        this.usuarioServicio.guardarSesion(_us);
        Swal.fire({
          icon: 'success',
          title: `Bienvenido ${_us[0].nombre } ` ,
          showConfirmButton: false,
          timer: 1000
        });
        setTimeout (() => {
          location.reload();
        }, 100 );
        return this.router.navigate(['/home']);

      }else{
        Swal.fire({
          title: 'Error',
          text: ` Usuario y/o contraseña incorrecta`,
          icon: 'error'
        });

      }
     });

  }


}
