import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/fileItem.model';
@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[] = [];
  @Output() mauseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor() { }


  @HostListener('dragover', ['$event'])
    public onDragEnter(event: any){
      this.mauseSobre.emit(true);
      this._prevenerDetener(event);
    }
    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: any){
      this.mauseSobre.emit(false);
    }
    @HostListener('drop', ['$event'])
    public onDrop(event: any){
      const transferencia = this._getTransferencia(event);
      if (!transferencia){
        return;
      }
      this._extraerArchivos(transferencia.files);
      this._prevenerDetener(event);
      this.mauseSobre.emit(false);


    }

    private _getTransferencia( event: any){
      return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    private _extraerArchivos( archivosLista: FileList ){
      // tslint:disable-next-line: forin
      for ( const propiedad in Object.getOwnPropertyNames(archivosLista)){

        const archivoTemp = archivosLista[propiedad];

        if (this._archivoPuedeSerCargado(archivoTemp)){
          const nuevoArchivo = new FileItem( archivoTemp );
          this.archivos.push(nuevoArchivo);
        }
      }
    }

    // validaciones

  private _archivoPuedeSerCargado (archivo: File): boolean{
    if(!this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type)){
      return true;
    }else{
      return false;
    }
  }
  private _prevenerDetener( event ){
    event.preventDefault();
    event.stopPropagation();
  }
  private _archivoYaFueDroppeado( nombreArchivo: string): boolean{
     for (const archivo of this.archivos){
       if ( archivo.nombreArchivo === nombreArchivo ){
          return true;
       }
     }
     return false;
  }

  private _esImagen(tipoArchivo): boolean{
    return(tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

}

