import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { UsuarioModel } from '../models/usuario.model';

interface ErrorValidate {
  [s: string]: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {
  usuarios: UsuarioModel[] = [];
  constructor( private http: HttpClient, public usuarioService: UsuarioService ) { 
  }

  existeUsuario(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> {
    if( !control.value){
      return Promise.resolve(null);
    }

    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        if ( control.value === 'strider' ){
            resolve({existe: true });
        }else{
          resolve(null);
        }
       }, 3500);
    });

  }
// existeUsuario2(control: FormControl): ErrorValidate {
//   let contador = 0;
//   this.usuarioService.getusuarios()
//   .subscribe( resp => {
//     this.usuarios = resp;
//   });

//   for (const usuario of this.usuarios) {
//     if (control.value?.toLowerCase () === usuario.usuario ){
//       contador++;
//     }
//   }
//   if (contador > 0 ){
//     return {
//       noHerrera: true
//     };
//   }else{
//     return null;
//   }
// }

// { CodigoPostalExiste(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> {
// if(!control.value){
//   return Promise.resolve(null);
// }
// const val: string = control.value;
// if( val.length !== 5 ){
//   return Promise.resolve(null);
// }
// return new Promise( (resolve, reject) => {
//   setTimeout(() => {
//     let problem: Boolean = false;
//     this.usuarioService.validaCP(val).subscribe(resp =>{
//        problem = resp.error;
//       });
//     if ( !problem ){
//         resolve({existe: true });
//     }else{
//       resolve(null);
//     }
//    }, 50);
// });}
// }
  horaValida(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> {
    if( !control.value){
      return Promise.resolve(null);
    }
    const val: string = control.value;
    if( val.length !== 5 ){
      return Promise.resolve(null);
    }
    const hora: number = Number( val.substring(0, 2) );
    const min: number  = Number( val.substring(3, 5) );
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        // && (  min === 0 || min === 20 || min === 40 )
        if ( !((hora >= 8 &&  hora < 20) && (  min === 0 || min === 20 || min === 40 ) ) ){
            resolve({existe: true });
        }else{
          resolve(null);
        }
       }, 50);
    });

    }
  passwordsIguales(pass1: string, pass2: string) {

    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual: true});
      }
    };
  }

}
