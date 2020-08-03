import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


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
import { NgDropFilesDirective } from './directive/ng-drop-files.directive';
import { CargaImagenesService } from './services/carga-imagenes.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
const config = {
  apiKey: 'AIzaSyDZfN7qua0BWePwr9YqcetGi35i8_R8_yo',
  authDomain: 'clinica-f0acc.firebaseapp.com',
  databaseURL: 'https://clinica-f0acc.firebaseio.com',
  projectId: 'clinica-f0acc',
  storageBucket: 'clinica-f0acc.appspot.com',
  messagingSenderId: '487170690603',
  appId: '1:487170690603:web:abb58ffc585bff4a41246e',
  measurementId: 'G-0DRM6EVXZ4'
};

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
    HomeComponent,
    NgDropFilesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutesModule,
    AngularFireModule.initializeApp(config),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

  ],
  providers: [ CargaImagenesService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
