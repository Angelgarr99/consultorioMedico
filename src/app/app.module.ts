import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/share/navbar/navbar.component';
import { FooterComponent } from './components/share/footer/footer.component';
import { UsuarioComponent } from './components/usuarios/usuario/usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { CitasComponent } from './components/citas/citas/citas.component';
import { CitaComponent } from './components/citas/cita/cita.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutesModule } from './app-routes.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    UsuarioComponent,
    UsuariosComponent,
    LoginComponent,
    CitasComponent,
    CitaComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
