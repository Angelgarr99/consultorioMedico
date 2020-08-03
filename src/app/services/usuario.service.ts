import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private  url = 'https://clinica-f0acc.firebaseio.com/';
  constructor(private http: HttpClient ) { }
  usuarios: UsuarioModel[] = [];
  crearUsuario(heroe: UsuarioModel){
    return this.http.post(`${this.url}/usuarios.json`, heroe)
    .pipe(
      map((resp: any) => {
        heroe.id = resp.name;
        return heroe;
      })
    );
  }
  // validaCP(cp: string): Observable<any> {
  //   if ( cp.length === 5 ){
  //   const response = this.http.get(`https://api-sepomex.hckdrk.mx/query/info_cp/${cp}?type=simplified`)
  //   .pipe(map((res: Response ) => res));
  //   return response;
  // }
  //   return null;
  // }
  // validaCP(cp: string): Observable<any> {
  //   return this.http.get(`https://api-sepomex.hckdrk.mx/query/info_cp/${cp}?type=simplified`)
  //   .pipe(
  //     map(resp => {
  //       return resp;
  //     }));
  // }
  // crearArregloCP(cpObj: object): CPModel{
  //   let cp: CPModel;
  //   if( cpObj ){
  //    cp = cpObj;
  //   }else{
  //     cp = null;
  //   } 
  // return cp;
  // }

  actualizarUsuario(usuario: UsuarioModel){
    const usuarioTemp = {
      ...usuario
    };
    return this.http.put(`${this.url}/usuarios/${usuario.id}.json`, usuarioTemp);
  }

  getUsuario( id: string){
    return this.http.get(`${this.url}/usuarios/${id}.json`);
  }
  borrarHeroe(id: string){
    return this.http.delete(`${this.url}/usuarios/${id}.json`);
  }
  getusuarios(){
    return this.http.get(`${this.url}/usuarios.json`)
    .pipe(
      map(resp =>  this.crearArreglo(resp))
    );
  }



  private crearArreglo(usuarioObj: object){
    const usuario: UsuarioModel[] = [];
    if (usuarioObj === null) {
       return [];
    }
    Object.keys(usuarioObj).forEach( key => {
      const user: UsuarioModel = usuarioObj[key];
      user.id = key;
      usuario.push(user);
    });
    return usuario;
  }

  public login(usuario: string, contrasena: string ){
    return this.http.get(`${this.url}/usuarios.json`)
    .pipe(
      map(resp =>  this.crearArregloLogin(resp, usuario, contrasena))
    );
  }
  guardarSesion(usuarios: UsuarioModel[]){
    const usuario = usuarios[0];
    sessionStorage.setItem('data', JSON.stringify(usuario));
  }
  logout(){
    sessionStorage.clear();
  }
  cargarrSorage(): UsuarioModel{
    if ( sessionStorage.getItem('data') ){
      const usuario: UsuarioModel = JSON.parse(sessionStorage.getItem('data'));
      return usuario;
    }else{
      return null;
    }

  }
  private crearArregloLogin(usuarioObj: object, _us: string, _pass: string){
    const usuario: UsuarioModel[] = [];
    if (usuarioObj === null) {
        return [];
    }
    Object.keys(usuarioObj).forEach( key => {
      const user: UsuarioModel = usuarioObj[key];
      user.id = key;
      if ( user.usuario === _us && user.contrasena === _pass ){
        usuario.push(user);
      }
    });
    if (usuario.length === 1 ){
      return usuario;
    }else{
      return null;
    }

  }

  estaLogeado(): boolean{
    const usuarioSesion: UsuarioModel = this.cargarrSorage();
    if (usuarioSesion !== null){
       return true;
    }
    return false;
   }
   esDoctor(): boolean{
   const usuarioSesion: UsuarioModel = this.cargarrSorage();
   if (usuarioSesion !== null){
    if (usuarioSesion.rol === 'doctor'){
      return true;
    }
   }
   return false;
  }
  esPaciente(): boolean{
    const usuarioSesion: UsuarioModel = this.cargarrSorage();
    if (usuarioSesion !== null){
     if (usuarioSesion.rol === 'paciente'){
       return true;
     }
    }
    return false;
   }
   getURL(): string{
    return 'https://angelgarr99.github.io/consultorioMedico/';
   }
}
