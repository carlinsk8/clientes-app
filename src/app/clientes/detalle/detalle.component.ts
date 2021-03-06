import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService, 
    private modalService: ModalService) { }

  ngOnInit() {}
  
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso= 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal('Error!','Debe seleccionar un archivo de formato imagen', 'error');
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      swal("Error!","Debe seleccionar una imagen","error");
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type ===HttpEventType.Response){
          let response:any = event.body;
          this.cliente=response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);
          swal('Exito!', response.mensaje, 'success');
        }
      });
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
    
  }

}
