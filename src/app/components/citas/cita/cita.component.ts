import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsuarioModel } from '../../../models/usuario.model';
import { CitasService } from '../../../services/citas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidadoresService } from '../../../services/validadores.service';
import { CitaModel } from '../../../models/citas.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html'
})

export class CitaComponent implements OnInit {
  @Output() modal: EventEmitter<any> = new EventEmitter();
  doctores: UsuarioModel[] = [];
  doctorSeleccionado: UsuarioModel;
  usuarioSesion: UsuarioModel;
  cargando = false;
  seleccionado = false;
  forma: FormGroup;
  fechaActual = new Date();
  fechaManana = new Date(this.fechaActual.setDate(this.fechaActual.getDate() + 1));
  fechaValidaFin = new Date(this.fechaActual.setDate(this.fechaActual.getDate() + 31));
  cita = new CitaModel();

  constructor( private citasService: CitasService, private fb: FormBuilder, private validadores: ValidadoresService,
               private usuarioServicio: UsuarioService, private router: Router){}
    ngOnInit(): void {
    
  }

  get fechaNoValido(){
    return this.forma.get('fecha').invalid && this.forma.get('fecha').touched;
  }
  get horaNoValido(){
    return this.forma.get('hora').invalid && this.forma.get('hora').touched;
  }
  get comentariosNoValido(){
    return this.forma.get('comentarios').invalid && this.forma.get('comentarios').touched;
  }
  crearFormulario(){
    this.forma = this.fb.group({
      fecha          : ['', [Validators.required]],
      hora           : ['', Validators.required, this.validadores.horaValida ],
      comentarios    : ['',  Validators.required ]
    });
  }
  agendarCita(doctor: UsuarioModel ){
    this.seleccionado = true;

    this.doctorSeleccionado = doctor;
  }
  cancelar(){
    this.seleccionado = false;

    this.doctorSeleccionado = null;
  }

  registrarCita(){
    Swal.fire({
      title: 'Espere',
      text: 'Realizando registro',
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
    }
    // alert

    const formulario = this.forma.value;
    this.cita.doctorId = this.doctorSeleccionado.id;
    this.cita.doctor = this.doctorSeleccionado;
    this.cita.pacienteId = this.usuarioSesion.id;
    this.cita.paciente = this.usuarioSesion;
    this.cita.fecha = formulario.fecha;
    this.cita.hora = formulario.hora;


    this.cita.comentarios = formulario.comentarios;
    this.cita.estatus = 'Programada';

    let peticion: Observable<any>;
    peticion = this.citasService.agendarCita(this.cita);
    peticion.subscribe( resp => {
      resp = this.cita;
      this.modal.emit('close');

      Swal.fire({
        title: 'Cita Agendada',
        text: `Se ha ajendado la cita correctamente`,
        icon: 'success'
      });
      this.router.navigate(['citas']);
    });

  }

}

