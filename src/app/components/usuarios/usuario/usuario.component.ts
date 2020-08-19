import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from '../../../models/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { CargaImagenesService } from '../../../services/carga-imagenes.service';
import { FileItem } from '../../../models/fileItem.model';
import { ValidadoresService } from '../../../services/validadores.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  ListaEspecialidades: string[] = ['Alergología', 'Anestesiología', 'Angiología', 'Cardiología', 'Cirugía cardíaca', 'Cirugía general', 'Cirugía oral y maxilofacial', 'Cirugía ortopédica', 'Cirugía pediátrica', 'Cirugía plástica', 'Cirugía torácica', 'Cirugía vascular', 'Dermatología', 'Endocrinología', 'Epidemiología', 'Farmacología', 'Fisioterapia', 'Gastroenterología', 'Geriatría', 'Ginecología', 'Hematología', 'Hepatología', 'Infectología', 'Medicina aeroespacial', 'Medicina de emergencia', 'Medicina del deporte', 'Medicina del trabajo', 'Medicina familiar', 'Medicina física y rehabilitación', 'Medicina intensiva', 'Medicina interna', 'Medicina preventiva y salud pública', 'Nefrología', 'Neumología', 'Neurocirugía', 'Neurología', 'Nutriología', 'Obstetricia', 'Oftalmología', 'Oncología médica', 'Oncología radioterápica', 'Otorrinolaringología', 'Pediatría', 'Psiquiatría', 'Reumatología', 'Toxicología', 'Traumatología', 'Urología'];
  id: string;
  mostrarContrasena = false;
  cpValido = false;
  tipoTextoContrasena = 'password';
  forma: FormGroup;
  contrasenaSegura = 0;
  colorPB = 'bg-danger';
  usuario = new UsuarioModel();
  usuarios: UsuarioModel[] = [];
  usuarioSesion: UsuarioModel;
  esMedico = false;
  esPaciente = false;
  estaEditando = false;
  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private route: ActivatedRoute,
               public cargaImagenes: CargaImagenesService,
               private validadores: ValidadoresService) {
    this.crearFormulario();
   }

  ngOnInit(): void {
    let error = false;
    let palabra = 'doctor';
    if ( this.route.snapshot.url[1].path === 'doctorNuevo' ){
      this.usuario.id = this.route.snapshot.url[2].path;
      this.esMedico = true;
      this.estaEditando = false;
    }else{
      this.id = this.route.snapshot.paramMap.get('id');
      this.usuarioSesion = this.usuarioService.cargarrSorage();
      if (this.id !== 'nuevo' && this.usuarioSesion ){
        this.estaEditando = true;
        if(this.usuarioSesion.rol === 'doctor' ){
          this.esMedico = true;
        }
        this.usuarioService.getUsuario(this.id)
        .subscribe( (resp: UsuarioModel) => {
          this.usuario = resp;
          this.usuario.id = this.id;
          this.cargarDataAlFormulario(this.usuario);
          if (this.usuarioSesion.rol){
            palabra = this.usuarioSesion.rol;
          }
          if( palabra === 'doctor' ){
            if (this.usuarioSesion.id === this.usuario.id ){
              this.estaEditando = true;
            }else if(palabra === 'doctor' && this.usuario.rol === 'paciente' ){
              this.esMedico = false;
              this.esPaciente = true;
              this.estaEditando = true;
            }else{
              this.estaEditando = false;
            }

          }else if(palabra === 'paciente' && this.usuarioSesion.id === this.usuario.id ){
              this.esPaciente = true;
              this.estaEditando = true;
          }else{
            error = true;
          }
          });
      }else if( this.id === 'nuevo'){
        this.estaEditando = false;
      }else{
        error = true;
      }
      if(error){
        Swal.fire({
          title: 'Error',
          text: ` No tiene permisos para estar en esta pagina`,
          icon: 'error'
        });
        this.router.navigate(['home']);
      }

    }
  }
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
      nombre      : ['', [Validators.required, 
        Validators.minLength(2), Validators.pattern('[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,."-]{2,48}')]],
      apellidos   : this.fb.group({
        apellido1 : ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,."-]{2,48}') ]],
        apellido2 : ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,."-]{2,48}') ]]
      }),
      curp        : ['', [Validators.required,
       Validators.minLength(18), Validators.maxLength(18)
      ], [this.validadores.curpValida]],
      usuario     : ['', Validators.required  ],
      fotoAux     : [],
      contrasena:  this.fb.group({
        pass1     : ['', [Validators.required], [this.validadores.validar_clave ]],
        pass2     : ['', [Validators.required]],
      }),
      correo      : ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}')] ],
      telefono    : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(14),  Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}') ]],
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
  mostrarPassword(){
    console.log(this.mostrarContrasena);
    this.mostrarContrasena = !this.mostrarContrasena;
    if(this.mostrarContrasena){
      this.tipoTextoContrasena = 'text';
    }else{
      this.tipoTextoContrasena = 'password';

    }
  }
  doctor(){
    return this.esMedico;
  }

  validar_clave(){
    console.log(this.forma.value.contrasena.pass1);
    const contrasenna = this.forma.value.contrasena.pass1;
    console.log(contrasenna);
    let mayuscula = false;
    let minuscula = false;
    let numero = false;
    let caracterRaro = false;
    let segura = 0;
    for(let i = 0;i < contrasenna.length;i++)
    {
      if(contrasenna.charCodeAt(i) >= 65 && contrasenna.charCodeAt(i) <= 90)
      {
        mayuscula = true;
      }
      else if(contrasenna.charCodeAt(i) >= 97 && contrasenna.charCodeAt(i) <= 122)
      {
        minuscula = true;
      }
      else if(contrasenna.charCodeAt(i) >= 48 && contrasenna.charCodeAt(i) <= 57)
      {
        numero = true;
      }
      else
      {
        caracterRaro = true;
      }
    }
    if(contrasenna.length >= 8){
      segura = segura + 20;
    }
    if(mayuscula){
      segura = segura + 20;
    }
    if(minuscula){
      segura = segura + 20;
    }
    if(numero){
      segura = segura + 20;
    }
    if(caracterRaro){
      segura = segura + 20;
    }
    switch (segura){
      case 20: {
        this.colorPB = 'bg-danger';
        break;
      }
      case 40: {
        this.colorPB = 'bg-danger';
        break;
      }
      case 60: {
        this.colorPB = 'bg-warning';
        break;
      }
      case 80: {
        this.colorPB = 'bg-warning';
        break;
      }
      case 100: {
        this.colorPB = 'bg-success';
        break;
      }
      default: {
        this.colorPB = 'bg-info';
        break;
     }
    }
    this.contrasenaSegura = segura;

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
        fotoAux: null,
        cedula: usuario.cedprod,
        especialidad: usuario.especialidad
    });
}
  guardar(){
    console.log(this.forma.value.fotoAux);

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
    if (this.forma.invalid || !bien ){
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
      peticion.subscribe( resp => {
        resp = this.usuario;
        if(!this.usuarioSesion){
          this.usuarioService.login(this.usuario.usuario, this.usuario.contrasena).subscribe (resp2 => {
            const _us: UsuarioModel[] = resp2;
            if ( resp2 !== null){
              this.usuarioService.guardarSesion(_us);
              Swal.fire({
                icon: 'success',
                title: `Bienvenido ${_us[0].nombre } ` ,
                showConfirmButton: false,
                timer: 1000
              });
              setTimeout (() => {
                location.reload();
              }, 100 );
              return this.router.navigate(['/home']);
            }
          });
        }
        Swal.fire({
          title: this.usuario.nombre,
          text: `Se ${txtAux} Correctamente`,
          icon: 'success'
        });
      });
    }else{
      peticion = this.usuarioService.crearUsuario(this.usuario);
      txtAux = 'Creo';
      peticion.subscribe( resp => {
        resp = this.usuario;
        if (!this.usuarioSesion){
          this.usuarioService.login(this.usuario.usuario, this.usuario.contrasena).subscribe (resp2 => {
            const _us: UsuarioModel[] = resp2;
            if ( resp2 !== null){
              this.usuarioService.guardarSesion(_us);
              Swal.fire({
                icon: 'success',
                title: `Bienvenido ${_us[0].nombre } ` ,
                showConfirmButton: false,
                timer: 1000
              });
              setTimeout (() => {
                location.reload();
              }, 100 );
              return this.router.navigate(['/home']);
            }
          });
        }
      });
    }
  }
  regresar(){
    if(this.usuarioSesion){
      if ( this.usuarioSesion.rol === 'doctor'){
        return this.router.navigate(['/usuarios']);
      }else if (this.usuarioSesion) {
        return this.router.navigate(['/home']);
      }
    }else{
      return this.router.navigate(['/login']);
    }

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
    return (this.forma.get('especialidad').invalid || this.forma.get('especialidad').value=== '' )&& this.forma.get('especialidad').touched;
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
