import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

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
  }).then(r=>r.json());
}
}