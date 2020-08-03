import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../../models/usuario.model';
import { CitasService } from '../../../services/citas.service';
import { CitaModel } from '../../../models/citas.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html'
})
export class CitasComponent implements OnInit {
misCitas: CitaModel[] = [];
misCitasDoctor: CitaModel[] = [];
cargando = false;
cargandoDoc = false;
esDoctor = false;
masInfo = false;
citaSeleccionada = new CitaModel();
usuarioSesion: UsuarioModel;
constructor( private citasService: CitasService, private usuarioServicio: UsuarioService,
             private router: Router ){}
  ngOnInit(): void {
    this.usuarioSesion = this.usuarioServicio.cargarrSorage();
    if (this.usuarioSesion === null){
      Swal.fire({
        title: 'Error',
        text: ` No tiene permisos para estar en esta pagina`,
        icon: 'error'
      });
      this.router.navigate(['login']);
    }
    if (this.usuarioSesion.rol === 'doctor'){
      this.esDoctor = true;
    }
    this.cargando = true;
    if(this.esDoctor){
      this.citasService.getMisCitasDoctor()
        .subscribe( resp => {
          this.misCitasDoctor = resp;
        });
    }
    this.citasService.getMisCitas()
    .subscribe( resp => {
      this.misCitas = resp;
      this.cargando = false;
    });
  }
  cancelar(cita: CitaModel){
    Swal.fire({
      title: ' Cancelar esta Cita',
      text: `¿Esta seguro que desea cancelar esta Cita?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if( resp.value ){
        this.actualizaCita(cita);
      }
    });
  }

  actualizaCita(cita: CitaModel){
    if (cita.paciente.curp === this.usuarioSesion.curp){
      cita.estatus = 'Cancelada por el paciente';
    }else{
      cita.estatus = 'Cancelada por el doctor';
    }
    let peticion: Observable<any>;
    peticion = this.citasService.actualizarCita(cita);
    peticion.subscribe( resp => {
      resp = cita;
    });


  }
  estatus( palabra: string ): boolean{
    palabra = palabra.slice(0, 9);
    if (palabra.toLocaleLowerCase() === 'cancelada' ){
      return false;
    }
    return true;
  }
  eliminar(cita: CitaModel, i: number){
    this.misCitas.splice(i, 1);
    this.citasService.borrarCita(cita.id).subscribe();
  }
  verMas(cita: CitaModel){
      this.masInfo = true;
      this.citaSeleccionada = cita;
  }

}
