import { inject, Injectable } from '@angular/core';
import { Cochera, NuevaCochera } from '../interfaces/cochera';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CocherasServiceService {

  auth = inject (AuthService);


agregarFila(datosEstadoCocheras: NuevaCochera ){
  return fetch("http://localhost:4000/cocheras/",{
    method: "POST",
    headers:{
      'Content-Type': "application/json",
      'Authorization' : `Bearer ${this.auth.getToken()}`,
    },
    body: JSON.stringify(datosEstadoCocheras),
  })
}

borrarFila(cocheraId : number){
  return fetch('http://localhost:4000/cocheras/' + cocheraId ,{
    method: "DELETE",
    headers:{
      'Content-Type': "application/json",
      'Authorization' : `Bearer ${this.auth.getToken()}`,
    }})
}

deshabilitarCochera(cochera: Cochera){
  return fetch(`http://localhost:4000/cocheras/${cochera.id}/disable`,{
    method: "POST",
    headers:{
      'Content-Type': "application/json",
      'Authorization' : `Bearer ${this.auth.getToken()}`,
    },
    // body: JSON.stringify(numeroFila),
  })
}

habilitarCochera(cochera:Cochera){
  return fetch(`http://localhost:4000/cocheras/${cochera.id}/enable`,{
    method: "POST",
    headers:{
      'Content-Type': "application/json",
      'Authorization' : `Bearer ${this.auth.getToken()}`,
    },
  })
}


cocheras(): Promise<Cochera[]> {
  return fetch('http://localhost:4000/cocheras', {
    method: 'GET',
    headers: {
      Authorization: "Bearer " + (this.auth.getToken() ?? ''),
    },
  }).then(r => r.json());
}

}
