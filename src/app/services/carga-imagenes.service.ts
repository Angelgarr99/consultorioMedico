import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/fileItem.model';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {
  private CARPETA_IMAGENES   = 'img';
  constructor( private db: AngularFirestore) { }

  CargarImagenesFirebase(imagenes: FileItem[]){
    const storageRef = firebase.storage().ref();
    for (const item of imagenes ){
      item.estaSubiendo = true;
      if (item. progreso  >= 100){
        continue;
      }
      const upLoadTask: firebase.storage.UploadTask =  storageRef
        .child(` ${ this.CARPETA_IMAGENES}/${item.nombreArchivo} `)
          .put(item.archivo);

      upLoadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot ) =>
            item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {
          storageRef.child(` ${ this.CARPETA_IMAGENES}/${item.nombreArchivo} `).getDownloadURL().then(res => {
            item.url = res;
            item.estaSubiendo = false;
            this.guardarImagen({
              name: item.nombreArchivo,
              url: item.url
            });
          });

      });

    }
  }

  private guardarImagen(imagen: { name: string, url: string }){
    this.db.collection(`/${ this.CARPETA_IMAGENES }`)
    .add(imagen) ;
  }
}

