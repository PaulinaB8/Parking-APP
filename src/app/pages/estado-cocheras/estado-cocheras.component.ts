import { Component,  inject } from '@angular/core';
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
  auth= inject (AuthService);
  cochera = inject(CocherasServiceService);
  router = inject(Router);

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
       this.getCocheras();
   })
   }
  

  cambiarDisponibilidadCochera(cocheraId:number){
  //   /**cambia la disponibilidad de una cochera, si está disponible la deshabilita y viceversa */
    const cochera = this.filas.find(cochera => cochera.id === cocheraId)!;
   if(cochera.deshabilitada)
     this.cochera.habilitarCochera(cochera).then(() => this.getCocheras());
   else
     this.cochera.deshabilitarCochera(cochera).then(() => this.getCocheras());;
 }
      // this.filas[numeroFila].deshabilitada =!this.filas[numeroFila].deshabilitada;


  datosEstadoCocheras = {
    descripcion: "Agregada por api",
  }


  agregarFila(){
    this.cochera.agregarFila(this.datosEstadoCocheras)
    .then(()=>{
      this.getCocheras()})
    .then((filas) =>{
        filas = filas;
      })
    }

    // patenteNueva: string = "";
    
   abrirModalNuevoEstacionamiento(id:number){
      Swal.fire({
        title: 'Ingrese el número de patente',
        input: 'text',
        showCancelButton : true,
        inputValidator(value) {
          if(!value){
            return "Ingrese una patente válida";
          }
          return 
        }
      }).then(res => {
        if(res.isConfirmed){
          this.estacionamientos.estacionarAuto(res.value,id).then(() =>{
      this.getCocheras();
    })
  }
  })
  }
    
  
    precios = inject(PreciosService);

    desocuparCochera(valor: string, cocheraId:number){
      Swal.fire({
        title: "Estás seguro de cerrar la cochera?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cerrar cochera"
      }).then(res => {
        if(res.isConfirmed){
          this.estacionamientos.desocuparCochera(valor).then((res) =>{
            res.json().then((resJson)=>{
              this.getCocheras();
              let costo = Math.trunc(resJson.costo).toLocaleString("es-ES");
              Swal.fire({
                title: "Cochera cerrada",
                text: `Total a cobrar = $${costo}`,
                icon: "success"
          });
            }) 
    }).catch(error => {
      console.log("Error al desocupar la cochera:", error);
    });
  }
})
    }
  

  }

          
  