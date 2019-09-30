import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Pedido } from '../../../class/pedido'
import { FuncionesJSService } from '../../../service/funciones-js.service';
import { DTConfig } from '../../../class/dtconfig';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css']
})
export class ListadoPedidosComponent implements OnInit {


  @ViewChild(DataTableDirective, null)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();

  appliedFilters:any[] = [];
  funciones:FuncionesJSService;

  pedidos:Pedido[]=[];

  constructor(private spinner: NgxSpinnerService, private funcionesP: FuncionesJSService,) { this.funciones = funcionesP;}

  ngOnInit() {
    this.spinner.show();
    let guardado = localStorage.getItem('pedido');
    this.pedidos = JSON.parse(guardado);
    this.initDtOptions();
    this.dtTrigger.next();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      this.funciones.addFilter(this, 0, "#filter-idPedido");
      this.funciones.addFilter(this, 4, "#filter-ciudad");
      this.funciones.addFilter(this, 5, "#filter-producto");  
    }
  }

}
