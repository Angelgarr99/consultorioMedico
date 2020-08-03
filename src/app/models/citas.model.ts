import { UsuarioModel } from './usuario.model';
import { Time } from '@angular/common';
export class CitaModel {
    id: string;
    paciente: UsuarioModel;
    pacienteId: string;
    doctor: UsuarioModel;
    doctorId: string;
    fecha: Date;
    hora: Time;
    estatus: string;
    comentarios: string;
constructor(){

}

}
