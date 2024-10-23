import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CocherasServiceService } from '../../services/cocheras.service.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { PreciosService } from '../../services/precios.service';
import { PreciosComponent } from '../precios/precios.component';


@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule,CommonModule,HeaderComponent], 
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent{
  filas: (Cochera & {activo: Estacionamiento|null})[] = [];

  cocheras = inject(CocherasServiceService)
  estacionamientos = inject(EstacionamientosService)

  ngOnInit(){
    this.getCocheras();

  }
  getCocheras(){
    return this.cocheras.cocheras().then(cocheras=>{
      this.filas = []; 

      for(let cochera of cocheras){
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento =>{
          this.filas.push({
            ...cochera, //reutiliza los parámetros del objeto anterior y le agrega un parámetro más
            activo: estacionamiento
          })
        })
      }
    });

  };

      // mostrarFilas(valor: Cochera ){
      //      let num : number = valor.id;   
      //      this.filas.push({
      //        id: num + 1,  // Usamos el valor pasado como argumento
      //        descripcion: valor.descripcion,
      //        deshabilitada: valor.deshabilitada,  // Hora actual
      //        eliminada: valor.eliminada  // Valor predeterminado para eliminada
      //      });}

        // id: ,
        // descripcion: string,
        // deshabilitada: new Date().toLocaleTimeString(),
        // eliminada: "-"
  
  showModal(indice: number){Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás volver a crearlo",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, borralo!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Borrado!",
        text: "La cochera ha sido borrada.",
        icon: "success",
        
      });
      this.botonEliminar(indice);
    }
  })};

  botonEliminar(cocheraId:number){
  this.cochera.borrarFila(cocheraId)
    .then(res => {
     if (!res.ok) {
       console.log("Error al eliminar una fila");
     }
   })
   .then(data => {
       console.log(data); 
       this.ngOnInit();
   })
   }
  

  cambiarDisponibilidadCochera(cocheraId:number, habilitada: boolean){
  //   /**cambia la disponibilidad de una cochera, si está disponible la deshabilita y viceversa */
    const cochera = this.filas.find(cochera => cochera.id === cocheraId)!;
   if(cochera.deshabilitada)
     this.cochera.habilitarCochera(cochera).then(() => this.ngOnInit());
   else
     this.cochera.deshabilitarCochera(cochera).then(() => this.ngOnInit());;
 }
      // this.filas[numeroFila].deshabilitada =!this.filas[numeroFila].deshabilitada;

 auth= inject (AuthService);

  router = inject(Router);
  datosEstadoCocheras = {
    descripcion: "Agregada por api",
  }

  cochera = inject(CocherasServiceService);

  agregarFila(){
    this.cochera.agregarFila(this.datosEstadoCocheras)
    .then(()=>{
      this.ngOnInit()})
    .then((filas) =>{
        filas = filas;
      })
    }

    patenteNueva: string = "";
    
   modalOcuparCochera(id:number) {
      Swal.fire({
        title: 'Ingrese el número de patente',
        input: 'text',
        customClass: {
          validationMessage: 'my-validation-message',
        },
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Se requiere la patente');
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Guarda el valor del input en una variable
          let valorIngresado = result.value;
          console.log('Número de patente ingresado:', valorIngresado);

          this.ocuparCochera(valorIngresado, id);
        }
      });
    }
    
    ocuparCochera(valor: string, cocheraId:number){
      let ocupar ={
        patente: valor,
        idCochera: cocheraId
      }
      this.estacionamientos.ocuparCochera(ocupar)
    }
  
    precios = inject(PreciosComponent);

    desocuparCochera(valor: string){
      Swal.fire({
        title: "Estás seguro de cerrar la cochera?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cerrar cochera"
      }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
          Swal.fire({
            title: "Cochera cerrada",
            text: "Total a cobrar = ",
            icon: "success"
          });
        }
      });
      let desocupar = {
        patente : valor,
        idUsuarioEgreso : "ADMIN"
      }
      this.estacionamientos.desocuparCochera(desocupar)
      .then(()=>{
        this.ngOnInit()})
    }
  
  
  
  }


    // return fetch("http://localhost:4000/cocheras/",{
    //   method: "POST",
    //   headers:{
    //     'Content-Type': "application/json",
    //     'Authorization' : `Bearer ${this.auth.getToken()}`,
    //   },
    //   body: JSON.stringify(this.datosEstadoCocheras),
    // })



// filas:{
//   nro: number,
//   disponibilidad: boolean,
//   ingreso: string,
//   acciones:boolean,
// } [] = [];
