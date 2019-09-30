import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../class/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private httpClient: HttpClient) { }

  //Hace el llamado al endpoint por metodo get y mapea el resultado al modelo.
    getProductos(){
        let url = `https://fvwzxk56cg.execute-api.us-east-1.amazonaws.com/mock/productos`
            return this.httpClient.get<Producto>(url);
    }
}