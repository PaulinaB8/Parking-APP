import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';
import {  UsoMes } from '../interfaces/reporte';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {

  auth = inject (AuthService);
  

  estacionamientos(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },
    }).then(r => r.json());
  }

  buscarEstacionamientoActivo(cocheraId: number) {
    return this.estacionamientos().then(estacionamientos => {
      let buscado = null;
      for (let estacionamiento of estacionamientos) {
        if (estacionamiento.idCochera === cocheraId &&
            estacionamiento.horaEgreso === null) {
          buscado = estacionamiento;
        }
      }
      return buscado;
    });
  }

  estacionarAuto(patenteAuto :string, idCochera : number){
    return fetch('http://localhost:4000/estacionamientos/abrir',{
      method:"POST",
      headers:{
        "Content-Type" : "application/json",
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },
      body: JSON.stringify({
        patente: patenteAuto,
        idCochera: idCochera,
        idUsuarioIngreso: "admin"
      }),
    }).then(r => r.json());
  }

  desocuparCochera(patente:string){
    return fetch('http://localhost:4000/estacionamientos/cerrar',{
      method:"PATCH",
      headers:{
        "Content-Type" : "application/json",
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },
      body: JSON.stringify({
        patente: patente,
        idUsuarioEgreso : "admin"
      }),
  })//.then(r=>r.json());
}


  getCosto(cocheraId:number): Promise<number | null>{
      return this.estacionamientos().then(estacionamientos => {
        let precio = 0;
      for (let estacionamiento of estacionamientos) {
        if (estacionamiento.idCochera === cocheraId &&
            estacionamiento.horaEgreso === null) {
              console.log(estacionamiento.costo)
            return estacionamiento.costo;
        }
      }
      return precio
    });
  }



  getUsoMensual(){
    return this.estacionamientos().then(estacionamientos => {
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
