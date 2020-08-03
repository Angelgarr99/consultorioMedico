import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../../models/usuario.model';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuarioSesion: UsuarioModel;
  esDoctor = false;
  esPaciente = false;
  logeado = false;
    constructor(private usuarioServicio: UsuarioService, private router: Router) {
     }
    ngOnInit(): void {
      this.permisos();
    }
  logout(){
  this.usuarioServicio.logout();
  this.logeado = false;
  this.esDoctor = false;
  this.esPaciente = false;
  return this.router.navigate(['login']);
  
  }
  misDatos(){
    return this.router.navigate([`usuario/${this.usuarioSesion.id}`]);
  }
  private permisos(){
    this.usuarioSesion = this.usuarioServicio.cargarrSorage();
    if (this.usuarioSesion !== null){
      if (this.usuarioSesion.rol === 'paciente'){
        this.logeado = true;
        this.esPaciente = true;
      }
      if (this.usuarioSesion.rol === 'doctor'){
        this.logeado = true;
        this.esPaciente = true;
        this.esDoctor = true;
      }
    }
  }
  
  }
  