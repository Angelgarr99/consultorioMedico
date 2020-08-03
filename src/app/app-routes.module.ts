import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { CitasComponent } from './components/citas/citas/citas.component';
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';
import { CitaComponent } from './components/citas/cita/cita.component';
import {LoginComponent} from './components/usuarios/login/login.component';



const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'usuarios', component: UsuariosComponent},
  { path: 'usuario/:id', component: UsuarioComponent },
  { path: 'usuario/doctorNuevo/:id', component: UsuarioComponent },
  {path: 'cita', component:CitaComponent},
  {path: 'citas', component: CitasComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
  
})
export class AppRoutesModule { }
