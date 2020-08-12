import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, concat } from 'rxjs';
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

  curpValida(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> {
    let band = true;
    if( !control.value){
      return Promise.resolve(null);
    }
    const val: string = control.value;
    if( val.length !== 18 ){
      return Promise.resolve(null);
    }
    let anioAux: string;
    const validaTexto = RegExp ('^[A-Z]+$', 'i');
    const validaConsonantes = RegExp ('^[B-DF-HJ-NP-TV-Z]+$', 'i');

    if (!(validaTexto.test(val.slice(0,4)) && validaTexto.test(val.slice(10,16))) ){
      band = false;
    }else{
      const anio: number = +(val.slice(4, 6));
      let dmax: number;
      if (anio > 21){
        anioAux = '19' + anio;
      }else if(anio >= 0 && anio <= 9){
        anioAux = '200' + anio;
      }else{
        anioAux = '20' + anio;
      }
      const anioVF: number = +(anioAux);
      if (!anioVF){
        band = false;
      }
      const mes: number = +(val.slice(6, 8));
      const dia = +(val.slice(8, 10));  
      switch (mes) {
        case 1: dmax = 31; break;
        case 2:
          if (anioVF % 4 === 0){
            dmax = 29;
          }else{
             dmax = 28;
          }
          break;
        case 3: dmax = 31; break;
        case 4: dmax = 30; break;
        case 5: dmax = 31; break;
        case 6: dmax = 30; break;
        case 7: dmax = 31; break;
        case 8: dmax = 31; break;
        case 9: dmax = 30; break;
        case 10: dmax = 31; break;
        case 11: dmax = 30; break;
        case 12: dmax = 31; break;
        default: band = false; break;
      }
      if (!((dia >= 1) && (dia <= dmax) && (mes >= 1) && (mes <= 12))) {
        band = false;
      }
      if ( !(val.slice(10, 11) === 'H' || val.slice(10, 11) === 'M')){
        band = false;
      }
      if ( !(val.slice(10, 11) === 'H' || val.slice(10, 11) === 'M')){
        band = false;
      }
      const listaEstados: string[] = ['AS', 'BC', 'BS', 'CC', 'CL', 'CM', 'CS', 'CH', 'DF', 'DG', 'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC', 'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ', 'YN', 'ZS'];
      if (!listaEstados.includes(val.slice(11, 13))){
        band = false;
      }
      if( !validaConsonantes.test(val.slice(12, 16))){
          band = false;
      }
      if (anioVF >= 2000 ){
        if (!validaTexto.test(val.slice(16, 17))){
          band = false;
        }
      }else{
        const mayor2000: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        if (!mayor2000.includes(val.slice(16, 17))){
          band = false;
        }
      }
      // GAAA990729HPLRGN24
      const ultimoDigito: number = + (val.slice(17, 18));
      if(!ultimoDigito){
        band = false;
      }


  }
    return new Promise( (resolve, reject) => {   setTimeout(() => {
      if ( band === false ){
        resolve({existe: true });
        }else{
          resolve(null);
       }}, 50);
    });

  }


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
