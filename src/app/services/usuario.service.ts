import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { }
  actualizarUsuario(usuario: UsuarioModel){
  console.log('actualizando');
  console.log(usuario);
  return null;
}

crearUsuario(usuario: UsuarioModel){
  console.log('Entro al crear Usuario');
  console.log(usuario);
    //prueba del commit2

  return null;
}
cargarrSorage(){ return null}
}
