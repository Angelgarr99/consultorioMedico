import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from '../../../services/validadores.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { CargaImagenesService } from '../../../services/carga-imagenes.service';
import { FileItem } from '../../../models/fileItem.model';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {
  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  id: string;
  cpValido = false;
  forma: FormGroup;
  usuario = new UsuarioModel();
  usuarioSesion: UsuarioModel;
  esMedico = false;
  esPaciente = false;
  estaEditando = false;
  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private route: ActivatedRoute,
               public cargaImagenes: CargaImagenesService ) {
    this.crearFormulario();
    this.crearListeners();
   }

  ngOnInit(): void {
  
  }

  // llenaCodigoPostal(valor: string ){
  //   if (valor.length === 5){
  //     this.usuarioService.validaCP(valor)
  //     .subscribe( resp => {
  //       this.cpS = resp;
  //       console.log(this.cpS);
  //       this.cpValido = true;
  //       console.log(this.cpS.error);
  //       console.log(this.cpS.response);
  //       console.log(this.cpS.response['asentamiento']);
  //       this.forma.value.direccion.ciudad = this.cpS.response['ciudad'];
  //       this.forma.value.direccion.estado = this.cpS.response['estado'];
  //     }, (error => {
  //      this.cpS = error.error;
  //      this.cpValido = this.cpS.error;
  //      console.log(this.cpS);
  //      this.cpValido = false;
  //      console.log(this.cpS.error);
  //     }));
  //   }else{
  //     this.cpValido = false;
  //   }
  // }
  cargarImagenes(){
    this.cargaImagenes.CargarImagenesFirebase( this.archivos );
    for (const foto of this.archivos){
      this.usuario.foto = foto.url;
    }
  }

  limpiarArchivos(){
    this.usuario.foto= null;
    this.archivos = [];
  }

  // { Seccion

// } seccion
  crearFormulario(){
      this.forma = this.fb.group({
      nombre      : ['', [Validators.required, Validators.minLength(5)]],
      apellidos   : this.fb.group({
        apellido1 : ['', [Validators.required, Validators.minLength(2), ]],
        apellido2 : ['', [Validators.required, Validators.minLength(2), ]]
      }),
      curp        : ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      usuario     : ['', Validators.required ],
      contrasena:  this.fb.group({
        pass1     : ['', [Validators.required]],
        pass2     : ['', [Validators.required]],
      }),
      correo      : ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}')] ],
      telefono    : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(14) ]],
      cp          : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cedula      : ['', [Validators.minLength(6), Validators.maxLength(10) ]],
      especialidad: ['', [Validators.minLength(1) ]],
      direccion:   this.fb.group({
        estado    : ['', Validators.required],
        ciudad    : ['', Validators.required],
        colonia   : ['', Validators.required],
        calle     : ['', Validators.required],
        numero    : ['', Validators.required],
      })
      });
  }
  crearListeners(){
  }

  doctor(){
    return this.esMedico;
  }


  cargarDataAlFormulario(usuario: UsuarioModel){
    this.forma.reset({
        nombre: usuario.nombre,
        apellidos: {
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2
        },
        curp: usuario.curp,
        usuario: usuario.usuario,
        cp: usuario.cp,
        direccion: {
          estado: usuario.estado,
          ciudad: usuario.ciudad,
          calle: usuario.calle,
          colonia: usuario.colonia,
          numero: usuario.numero,
        },
        telefono: usuario.telefono,
        correo: usuario.correo,
        contrasena: {
          pass1: usuario.contrasena,
          pass2: usuario.contrasena
        },
        imagen: usuario.foto,
        cedula: usuario.cedprod,
        especialidad: usuario.especialidad
    });
}
  guardar(){
    Swal.fire({
      title: 'Espere',
      text: 'Guardando Información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    let bien = true;
    if (this.usuario.foto){

    for (const foto of this.archivos){
      this.usuario.foto = foto.url;
    }
  }
    if (this.esMedico){
      if (!this.usuario.foto) {
        bien = false;
      }
    }
    if (this.forma.invalid && bien){
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
      // alert
    }
    const aux = this.forma.value;
    let cedAux;
    if (this.esMedico){
      cedAux = aux.cedula;
    }else{
      cedAux = null;
    }
    if ( aux.nombre ){
      this.usuario.nombre = aux.nombre;
    }
    if ( aux.apellidos.apellido1 ){
      this.usuario.apellido1 = aux.apellidos.apellido1;
    }
    if ( aux.apellidos.apellido2 ){
      this.usuario.apellido2 = aux.apellidos.apellido2;
    }
    if ( aux.telefono ){
      this.usuario.telefono = aux.telefono;
    }
    if ( aux.especialidad ){
      this.usuario.especialidad = aux.especialidad;
    }

    if ( aux.correo ){ this.usuario.correo = aux.correo; }
    if ( aux.cp ) {
      this.usuario.cp = aux.cp;
    }
    if ( aux.direccion ){
      this.usuario.colonia = 'colonia';
      this.usuario.estado = aux.direccion.estado;
      this.usuario.ciudad = aux.direccion.ciudad;
      this.usuario.calle = aux.direccion.calle;
      this.usuario.numero = aux.direccion.numero;
     }
    if (aux.curp ){
      this.usuario.curp = aux.curp;
     }
    if (aux.usuario ){
      this.usuario.usuario = aux.usuario;
    }
    if (cedAux){
      this.usuario.cedprod = cedAux;
      this.usuario.rol = 'doctor';
    }else{
      this.usuario.cedprod = null;
      this.usuario.rol = 'paciente';
    }

    if ( aux.contrasena.pass1 ){
      this.usuario.contrasena = aux.contrasena.pass1;
    }


    let peticion: Observable<any>;
    var txtAux;
    if ( this.usuario.id ){
      peticion = this.usuarioService.actualizarUsuario(this.usuario);
      txtAux = 'Actualizo';
    }else{
      peticion = this.usuarioService.crearUsuario(this.usuario);
      txtAux = 'Creo';
    }
    peticion.subscribe( resp => {
      resp = this.usuario;
      Swal.fire({
        title: this.usuario.nombre,
        text: `Se ${txtAux} Correctamente`,
        icon: 'success'
      });
    });

  }
  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }
  get apellido1NoValido(){
    return this.forma.get('apellidos.apellido1').invalid && this.forma.get('apellidos.apellido1').touched;
  }
  get apellido2NoValido(){
    return this.forma.get('apellidos.apellido2').invalid && this.forma.get('apellidos.apellido2').touched;
  }
  get curpNoValida(){
    return this.forma.get('curp').invalid && this.forma.get('curp').touched;
  }
  get usuarioNoValido(){
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched;
  }
  get correoNoValido(){
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }
  get telefonoNoValido(){
    return this.forma.get('telefono').invalid && this.forma.get('telefono').touched;
  }

  get cedulaNoValido(){
    return this.forma.get('cedula').invalid && this.forma.get('cedula').touched;
  }

  get cpNoValido(){
    return this.forma.get('cp').invalid && this.forma.get('cp').touched;
  }
  get especialidadNoValido(){
    return this.forma.get('especialidad').invalid && this.forma.get('especialidad').touched;
  }

  get coloniaNoValido(){
    return this.forma.get('direccion.colonia').invalid && this.forma.get('direccion.colonia').touched;
  }
    get calleNoValido(){
    return this.forma.get('direccion.calle').invalid && this.forma.get('direccion.calle').touched;
  }
  get numeroNoValido(){
    return this.forma.get('direccion.numero').invalid && this.forma.get('direccion.numero').touched;
  }
  get estadoNoValido(){
    return this.forma.get('direccion.estado').invalid && this.forma.get('direccion.estado').touched;
  }
  get ciudadNoValido(){
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched;
  }
  get pass1NoValido(){
    return this.forma.get('contrasena.pass1').invalid && this.forma.get('contrasena.pass1').touched;
  }
  get pass2NoValido(){
    const pass1 = this.forma.get('contrasena.pass1').value;
    const pass2 = this.forma.get('contrasena.pass2').value;
    return (pass1 === pass2) ? false : true ;
  }
}
