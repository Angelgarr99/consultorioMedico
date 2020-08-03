import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioModel } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioModel[] = [];
  cargando = false;
  doctorNuevo = new UsuarioModel();
  dioClic = false;
  usuarioSesion: UsuarioModel;
  pathUrl = this.usuarioService.getURL();
  constructor( private route: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) { }


  ngOnInit(): void {
    this.usuarioSesion = this.usuarioService.cargarrSorage();
    if (this.usuarioSesion=== null){
      Swal.fire({
        title: 'Error',
        text: ` No tiene permisos para estar en esta pagina`,
        icon: 'error'
      });
      this.router.navigate(['login']);
    }else if (this.usuarioSesion.rol !== 'doctor'){
        Swal.fire({
          title: 'Error',
          text: ` No tiene permisos para estar en esta pagina`,
          icon: 'error'
        });
        this.router.navigate(['home']);
      }

    this.cargando = true;
    this.usuarioService.getusuarios()
    .subscribe( resp => {
      this.usuarios = resp;
      this.cargando = false;
    });

  }
  TraerEdad( usuario: UsuarioModel ){
    var fecha: string;
    if (usuario.curp){ 
    const anio = usuario.curp.slice(4, 6);
    const anio2: number = +anio;
    const mes = usuario.curp.slice(6, 8);
    const dia = usuario.curp.slice(8, 10);
    if (anio2 <  23){
      fecha = `${mes}-${dia}-20${anio}`;
    }else{
      fecha = `${mes}-${dia}-19${anio}`;
    } 
    const fechafin = new Date(fecha);
    const timeDiff = Math.abs(Date.now() - fechafin.getTime());
    const showAge = Math.floor((timeDiff / ((1000 * 3600 * 24)) / 365));
    return showAge;
  }else{return ; }
  }

  borrarUsuario(usuario: UsuarioModel, i: number){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `¿Esta seguro que desea borrar a ${usuario.nombre}?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if( resp.value ){
        this.usuarios.splice(i, 1);
        this.usuarioService.borrarHeroe(usuario.id).subscribe( res => {
        });
      }
    });

  }
  AgregarDoctor(accion: string){
    this.dioClic = true;
    if(accion === 'agregar'){
      this.doctorNuevo.rol = 'doctor';
      const peticion: Observable<any> = this.usuarioService.crearUsuario(this.doctorNuevo);
      peticion.subscribe( resp => {
        this.doctorNuevo = resp;
        this.usuarios.push(this.doctorNuevo);
        // tslint:disable-next-line: no-unused-expression
      });
    }else{
      this.doctorNuevo.id = accion;
    }
  }
  cerrarModal(){
    this.dioClic = false;
  }

}
