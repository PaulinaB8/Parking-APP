import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { Precio } from '../../interfaces/precios';
import { PreciosService } from '../../services/precios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.scss'
})
export class PreciosComponent {

  precio = inject(PreciosService)

  filas : Precio[] = [];

  

  ngOnInit(){
    this.getPrecios();

  }

  getPrecios(){
    this.precio.getTarifas().then(precios=>{
      this.filas = precios; 

  })}


  modalCambiarPrecios(precioCambiar:number){
    Swal.fire({
      title: 'Ingrese el nuevo precio',
      input: 'text',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Se requiere un nuevo precio');
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let valorIngresado = result.value;
        this.cambiarPrecios(valorIngresado, precioCambiar);
      }
    }).then(()=>{
      this.getPrecios();
    })
  }


  cambiarPrecios(precio: number, id: number){
    this.precio.cambiarTarifa(precio,id).then(data => {
      console.log(data); 
      this.ngOnInit();
  })
  }
  }


