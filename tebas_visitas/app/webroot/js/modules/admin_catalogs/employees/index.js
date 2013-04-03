$(document).ready(function(){

     var base_url = document.location.protocol + '//' + document.location.host + '/';
     var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/employees/fn_load_permits'); // se cargan los permisos
      
      // se inicializa la clase pasando los parametros de configuracion
      crud_library.init({
            
             
            items: {
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form',
                  item:'catalogo-table'
            },
                  
            permits: permits,
            
            config_dialog:{
                  
                  width:'350',
                  height:'650'
            },
            
            url:{
                  add: base_url + 'admin_catalogs/employees/add',
                  view: base_url + 'admin_catalogs/employees/view',
                  edit: base_url + 'admin_catalogs/employees/edit',
                  del: base_url + 'admin_catalogs/employees/delete',
                  pdf: base_url + 'admin_catalogs/employees/grid_get_pdf/',
                  excel: base_url + 'admin_catalogs/employees/grid_get_excel'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar al empleado.',
                  edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el empleado.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el empleado.',
                  
                  del_confirm:'Estas seguro de querer eliminar al empleado.',
                  del_success:'El empleado ha sido eliminado con exito.'
            },
            
            no_uppercase: ['email', 'local_email']
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table").catalogoTable5({
            
            title: 'Tabla de Empleados',
            load_url: base_url + 'admin_catalogs/employees/grid_paginate',
         
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
            
                  name:{
                        title: 'Nombre',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.name',
                        validate:'numeric'
                  }, 
                  
                  lastname_father:{
                        title: 'Apehido Paterno',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.lastname_father'
                  },
                  
                  lastname_mother:{
                        title: 'Apehido Materno',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.lastname_mother'
                  },
                  
//                  numero:{
//                        title: 'numero',
//                        width: '20%',
//                        sortable: true,
//                        pivot: true,
//                        pivot_title: 'employees.numero'
//                  },
                  
                  phone_number: {
                        title: 'Numero Tel.',
                        width: '11%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.phone_number'
                  },
                  
                  email: {
                        title: 'Email',
                        width: '11%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.email'
                  },
                  
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                  Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              crud_library.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  },
            
                  Pdf:{
                        title: 'Pdf',
                        fn:function(){
                              
                              var filtro = $("#catalogo-table").catalogoTable5('postData');
                              crud_library.pdf(filtro);
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/employees/grid_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                  View:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              crud_library.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              crud_library.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
                  
                  
            }
            
      });
      
      
});