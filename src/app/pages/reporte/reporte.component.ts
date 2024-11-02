import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { UsoMes } from '../../interfaces/reporte';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent implements OnInit {
  router = inject(Router);
  estacionamientos = inject(EstacionamientosService)

  reportes : UsoMes [] = [];

  ngOnInit(){
     this.getUsoMensual().then(res =>{
      this.reportes = res; 
     })
  }

  getUsoMensual(){
    return this.estacionamientos.estacionamientos().then(estacionamientos => {
      let historial: UsoMes[] = []
        for (let estacionamiento of estacionamientos) {

          if (estacionamiento.horaEgreso !== null){
            let fecha = new Date(estacionamiento.horaEgreso);
            let mes = fecha.toLocaleDateString("es-Cl", {
            month: "numeric",
            year: "numeric",
          })
          const indiceEncontrado = historial.findIndex((buscado) => buscado.periodo === mes);
          let costoRedondeado: number = Math.round(estacionamiento.costo)
          if(indiceEncontrado === -1){
            historial.push({periodo:mes, usos: 1, cobrado:costoRedondeado})
          } else {
            historial[indiceEncontrado].usos++;
            historial[indiceEncontrado].cobrado+= costoRedondeado;
          }
          
          
        }
      }
      return historial
      }
      )}
  }



