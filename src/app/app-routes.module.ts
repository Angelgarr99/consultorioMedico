import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { CitasComponent } from './components/citas/citas/citas.component';
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';



const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'usuario', component: UsuarioComponent},
  {path: 'citas', component: CitasComponent},

  {path: '**', pathMatch: 'full', redirectTo: 'home'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
  
})
export class AppRoutesModule { }
