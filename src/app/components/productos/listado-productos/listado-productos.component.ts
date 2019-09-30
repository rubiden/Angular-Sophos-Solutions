import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../../class/producto';
import { ProductoService } from '../../../service/producto.service';
import swal from'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm, FormControl } from '@angular/forms';
import { Pedido } from '../../../class/pedido';
import { Ciudad } from '../../../class/ciudad';

declare var $:any;

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css']
})
export class ListadoProductosComponent implements OnInit {

  productos:Producto[]=[];
  imagen:string;
  pedido:Pedido = new Pedido();
  ciudades:any[] = Ciudad.ciudad;
  producto:Producto = new Producto();
  isValid:string="";
  es: any;

  constructor(private router:Router, private _productoService:ProductoService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    this._productoService.getProductos().subscribe((data : Producto) =>{
      for (let index = 0; index < data["length"]; index++) {
        this.productos.push(data[index]);      
      }
      this.spinner.hide();
    }, err=> {
      swal.fire({
        type: 'error',
        title: 'Error',
        text: "Error en el servicio, vuelva a intentarlo",
      });
      this.spinner.hide(); 
    });

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
      dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
      today: 'Hoy',
      clear: 'Limpiar'
  };

  }

  viewImagen(imagen:string){
    this.imagen=imagen;
    $('#modalImagen').modal('show');
  }

  modalPedido(producto:Producto){
    if (producto.cantidadDisponible <= 0) {
      swal.fire({
        type: 'error',
        title: 'Error',
        text: "El producto seleccionado no tiene cantidad disponible",
      });
      return
    }
    this.producto = producto;
    this.pedido = {};
    $('#modalPedido').modal('show');
  }

  validation(control:FormControl){
    if(control.valid==false){
      this.isValid="is-invalid";
    }else{
      this.isValid="";
    }
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.pedido.archivo=file;
    }
  }

  onClearFile(){
    this.pedido.archivo=null;
  }

  realizarPedido(form:NgForm, soporte){
    if(!form.valid){
      swal.fire(
        "Error",
        "Revise los campos y vualva a intentarlo",
        "error",
      );
      if(!form.controls.fecha_nacimiento.valid){
        this.isValid="is-invalid";
      }else{
        this.isValid="";
      }
      return
    }

    if(!this.pedido.archivo){
      swal.fire(
        "Error",
        "Debe anexar el archivo de su cedula",
        "error",
      );
      return
    }

    if (this.pedido.idCiudad == null) {
      swal.fire(
        "Error",
        "Debe seleccionar una ciudad.",
        "error",
      );
      return
    }

    if (this.pedido.cantidad > this.producto.cantidadDisponible) {
      swal.fire(
        "Error",
        "La cantidad ingresada supera la cantidad disponible del producto.",
        "error",
      );
      return
    }

    this.spinner.show();

    let archivo = this.pedido.archivo["name"];
    this.pedido.archivo = archivo;

    for (let i = 0; i < this.ciudades.length; i++) {
      if (this.ciudades[i].id == this.pedido.idCiudad) {
        this.pedido.nombreCiudad = this.ciudades[i].nombreCiudad;
        break;
      }    
    }

    let guardado = localStorage.getItem('pedido');

    let pedidos:any[]=[];

    pedidos = JSON.parse(guardado);


    let cont = 0;
    if (pedidos) { 
      for (let index = 0; index < pedidos.length; index++) {
        if (pedidos[index].idPedido > cont) {
          cont = pedidos[index].idPedido;
        }     
      }
    }

    this.pedido.idPedido = cont + 1;
    this.pedido.nombreProducto = this.producto.descripcion;
    // this.pedido.nombreCiudad = this.pedido.ciudad["nombreCiudad"];

    if (pedidos == null) {
      pedidos = [];
      pedidos[0] = this.pedido
    }else{
      pedidos.push(this.pedido);
    }

    localStorage.setItem('pedido', JSON.stringify(pedidos) );

    swal.fire({
      type: "success",
      title: "Realizado",
      text: "Compra realizada exitosamente.",
      timer: 2000,
      showConfirmButton: false
    });

    soporte.clear();
    form.resetForm();
    this.pedido = {};
    $('#modalPedido').modal('hide');


    this.spinner.hide();
  }

}
