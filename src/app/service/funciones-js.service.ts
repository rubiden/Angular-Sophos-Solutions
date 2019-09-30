import { Injectable } from '@angular/core';
declare var $:any;

@Injectable({
  providedIn: 'root'
})

export class FuncionesJSService {

  constructor() { }

  addFilter(parent:any, idx:number, idElement:string){
    parent.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let parentTable = this;
      let select = $('<select class="form-control input-sm"><option value="">- Mostrar todos -</option></select>')
          .appendTo( $(idElement) )
          .on( 'change', function () {
              var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
              );
              
              parentTable.showFilter(parent,{idx: idx, idElement: idElement, name: ($(this).val() != "") ? dtInstance.column(idx).header().textContent + " : " + $(this).val() : ""});
              
              dtInstance.column(idx).search( val ? '^'+val+'$' : '', true, false )
                  .draw();
          } );
          
      dtInstance.column(idx).data().unique().sort().each( function ( d, j ) {
      select.append( '<option value="'+d+'">'+d+'</option>' )
      } );
    });
  }

  showFilter(parent:any, obj:any){
    let isInArr = -1;
    
    for(let i = 0; i < parent.appliedFilters.length; i++){
      if(parent.appliedFilters[i].idx == obj.idx){
        isInArr = i;
        break;
      }
    }
    if(isInArr > -1){
      if(obj.name == ""){
        this.removeFilter(parent, obj);
      }else{
        parent.appliedFilters[isInArr].name = obj.name;
      }
      
    }else{
      parent.appliedFilters.push(obj);
    }
    
  }

  removeFilter(parent:any, obj:any){
    parent.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(obj.idx).search("")
      .draw();
    });

    for(let i = 0; i < parent.appliedFilters.length; i++){
      if(parent.appliedFilters[i].idx == obj.idx){
        parent.appliedFilters.splice(i, 1);
        break;
      }
    }
    $(obj.idElement + ' option[value=""]').attr("selected", true);
  }
}