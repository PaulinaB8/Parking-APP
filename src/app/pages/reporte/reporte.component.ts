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
     this.estacionamientos.getUsoMensual().then(res =>{
      this.reportes = res; 
     })
  }

  }



