import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioModel } from '../models/usuario.model';
import { CitaModel } from '../models/citas.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private url = 'https://clinica-f0acc.firebaseio.com';
  constructor( private http: HttpClient, private usuarioService: UsuarioService) { }
  agendarCita(cita: CitaModel){
    cita.doctor.id = null;
    cita.doctor.telefono = null;
    cita.doctor.correo = null;
    cita.doctor.cp = null;
    cita.doctor.colonia = null;
    cita.doctor.estado = null;
    cita.doctor.ciudad = null;
    cita.doctor.calle = null;
    cita.doctor.numero = null;
    cita.doctor.usuario = null;
    cita.doctor.contrasena = null;
    cita.doctor.rol = null;
    cita.doctor.cedprod = null;
    cita.doctor.foto = null;
    cita.paciente.id = null;
    cita.paciente.telefono = null;
    cita.paciente.correo = null;
    cita.paciente.cp = null;
    cita.paciente.colonia = null;
    cita.paciente.estado = null;
    cita.paciente.ciudad = null;
    cita.paciente.calle = null;
    cita.paciente.numero = null;
    cita.paciente.usuario = null;
    cita.paciente.contrasena = null;
    cita.paciente.rol = null;
    cita.paciente.cedprod = null;
    cita.paciente.foto = null;
    return this.http.post(`${this.url}/cita.json`, cita)
    .pipe(
      map((resp: any) => {
        cita.id = resp.name;
        return cita;
      })
    );
  }

  getDoctores(){
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
      if (user.rol === 'doctor' && user.foto ){
        usuario.push(user);
      }
    });
    return usuario;
  }
  actualizarCita(cita: CitaModel){
    const citaTemp = {
      ...cita
    };
    citaTemp.id = null;
    return this.http.put(`${this.url}/cita/${cita.id}.json`, citaTemp);
  }
  borrarCita(id: string){
    return this.http.delete(`${this.url}/cita/${id}.json`);
  }
  getMisCitas(){
    return this.http.get(`${this.url}/cita.json`)
    .pipe(
      map(resp =>  this.crearArregloMisCitas(resp))
    );
  }
  getMisCitasDoctor(){
    return this.http.get(`${this.url}/cita.json`)
    .pipe(
      map(resp =>  this.crearArregloMisCitasDoctor(resp))
    );
  }
  private crearArregloMisCitas(citaObj: object){
    const paciente: UsuarioModel = this.usuarioService.cargarrSorage();
    const citas: CitaModel[] = [];
    if (citaObj === null) {
      return [];
    }
    Object.keys(citaObj).forEach( key => {
      const cita: CitaModel = citaObj[key];
      cita.id = key;
      if (cita.pacienteId === paciente.id ) {
        // cita.paciente = this.usuarioService.cargarrSorage();
        citas.push(cita);
      }
    });
    return citas;
  }
  private crearArregloMisCitasDoctor(citaObj: object){
    const doctor: UsuarioModel = this.usuarioService.cargarrSorage();
    const citas: CitaModel[] = [];
    if (citaObj === null) {
      return [];
    }
    Object.keys(citaObj).forEach( key => {
      const cita: CitaModel = citaObj[key];
      cita.id = key;
      if (cita.doctorId === doctor.id ) {
        citas.push(cita);
      }
    });
    return citas;
  }

}
