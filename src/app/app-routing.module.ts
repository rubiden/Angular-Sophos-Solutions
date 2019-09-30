import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoProductosComponent } from '../app/components/productos/listado-productos/listado-productos.component';
import { ListadoPedidosComponent } from './components/pedidos/listado-pedidos/listado-pedidos.component';


const routes: Routes = [
  { path: '', component: ListadoProductosComponent, pathMatch: 'full' },
  { path: 'pedidos', component: ListadoPedidosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
