import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(datosLogin:Login){
    return fetch ("http://localhost:4000/login",{
      // para conectar con el backend , función asíncrona: mientras espera la respuesta del back, salta a la siguiente, no espera al back antes de ejercutar lo otro
      method: "POST",
      headers:{
        "Content-Type" : "application/json"
        // cuando le pongo application/json es para que lea datos tipos json
      },
      body: JSON.stringify(datosLogin),
     }).then(res=>{ 
      return res.json()
      //para que se ejecute luego de recibir la respuesta
      .then(data =>{
     if(data.status==="ok"){
      //Login correcto
      localStorage.setItem('token', data.token);
      return true;
      // para guardar algo (data.token) en una variable (token)
    }else{
      //Login incorrecto
      return false;
    }
    console.log ("recibi respuesta del back", res.json)
  });
  });
  };

  getToken(): string{
    return localStorage.getItem('token')??'';
  }

  estaLogueado():boolean{
    if (this.getToken())
      return true;
    else
    return false;
  }

  logOut():void{
    localStorage.setItem('token', "");
  }
}
