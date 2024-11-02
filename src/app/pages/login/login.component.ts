import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  // tiene que ver con angular
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  router = inject(Router);
  auth = inject (AuthService);

  datosLogin: Login = {
    username: "",
    password: "",
  }

  login(){
    // inicia sesion 
    this.auth.login(this.datosLogin)
    .then(res=>{
        if (res){
          this.router.navigate(['/estado-cocheras']);
      }else{
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "El usuario o la contraseña son incorrrectos",
          });
        }
  });
}

}

