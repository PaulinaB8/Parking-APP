import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent {
  router = inject(Router);



}
