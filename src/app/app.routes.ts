import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { PreciosComponent } from './pages/precios/precios.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';


function guardaLogueado(){
    let auth = inject(AuthService); // esto es una variable, a diferencia de la otra vez que lo pusimos
    let router = inject(Router);
    if (auth.estaLogueado())
        return true;
    else
        router.navigate(['/login']);
        return false;
}

export const routes: Routes = [
    {
        path: "login", 
        component: LoginComponent
    },
    {
        path:"estado-cocheras",
        component: EstadoCocherasComponent,
        canActivate: [guardaLogueado]//admite un array de funciones. Para acceder a esta url te tiene que dejar pasar esta funcion 
    },
    {
        path:"reportes",
        component: ReporteComponent,
    },
    {
        path:"precios",
        component: PreciosComponent,
    },
    {
        path:"", 
        redirectTo: "login",
        pathMatch: "full"
    }
];
