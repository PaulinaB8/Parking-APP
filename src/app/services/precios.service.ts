import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Precio } from '../interfaces/precios';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  auth= inject(AuthService);

  getTarifas() : Promise<Precio[]>{
    return fetch('http://localhost:4000/tarifas', {
      method: "GET",
      headers:{
      'Authorization' : `Bearer ${this.auth.getToken()}`,
      }
    }).then(r => r.json());
  }

  

  cambiarTarifa(nuevaTarifa: number, id:number){

    let url = '';
    
    if (id === 0) {
        url = 'https://localhost:4000/tarifas/MEDIAHORA';
    } else if (id === 1) {
        url = 'https://localhost:4000/tarifas/PRIMERAHORA';
    } else if (id === 2) {
        url = 'https://localhost:4000/tarifas/VALORHORA';
    } else {
        return Promise.reject(new Error('ID inválido'));
    }
      return fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.auth.getToken()}`, // reemplaza con el token adecuado
          },
          body: JSON.stringify({ 
            valor: nuevaTarifa,
            idUsuarioEgreso : "admin"
            }),
      })
      .then(res => res.ok)
      .catch(() => false);
  }  
  }
  //   if(id ===0)
  //     return fetch(`https://localhost:4000/tarifas/MEDIAHORA`,{
  //       method:"PUT",
  //       headers:{
  //         "Content-Type" : "application/json",
  //         'Authorization' : `Bearer ${this.auth.getToken()}`,
  //       },
  //       body: JSON.stringify({"valor": nuevaTarifa}),
  //     }).then(res=>{ 
  //       if (res){
  //         return true
  //       }else{
  //         return false
  //       }
  //     })
  //   else if(id ===1)
  //       return fetch(`https://localhost:4000/tarifas/PRIMERAHORA`,{
  //         method:"PUT",
  //         headers:{
  //           "Content-Type" : "application/json",
  //           'Authorization' : `Bearer ${this.auth.getToken()}`,
  //         },
  //         body: JSON.stringify({"valor": nuevaTarifa}),
  //       }).then(res=>{ 
  //         if (res)
  //           return true
  //         else
  //           return false
  //         })
  //     else(id ===2)
  //           return fetch(`https://localhost:4000/tarifas/VALORHORA`,{
  //             method:"PUT",
  //             headers:{
  //               "Content-Type" : "application/json",
  //               'Authorization' : `Bearer ${this.auth.getToken()}`,
  //             },
  //             body: JSON.stringify({"valor": nuevaTarifa}),
  //           }).then(res=>{ 
  //             if (res)
  //               return true
  //             else
  //               return false
  //             })
  // }

