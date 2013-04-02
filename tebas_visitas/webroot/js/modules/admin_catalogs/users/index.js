$(document).ready(function(){

      var base_url = document.location.protocol + '//' + document.location.host + '/';
      var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/users/fn_load_permits'); // se cargan los permisos
     
      // agregamos las clases css que ocupa el plugin validateengine para la validacion de los formularios
      $('#catalogo-form').find('#employee_id').addClass('validate[required]');
      $('#catalogo-form').find('#username').addClass('validate[required]');
      $('#catalogo-form').find('#password').addClass('validate[required]');
      $('#catalogo-form').find('#passconf').addClass('validate[required]');
      
      // inicializamos el plugin del autocompletado
//      $("#employee_id").fcbkcomplete({
//            json_url: base_url + "admin_catalogs/users/fn_get_employees"
//            , 
//            addontab: true
//            , 
//            maxitems: 1
//            , 
//            input_min_size: 0
//            , 
//            cache: false
//            , 
//            width:385
//            , 
//            select_all_text: "Todos"
//            , 
//            filter_selected : true
//            , 
//            display_results:'block'
//            , 
//            no_items:'No se encontraron Empleados'
//            , 
//            heigh: 100
//      });
      
      
      
//      $("#employee_name").autocomplete({
//            
//            source:  base_url + "admin_catalogs/users/fn_get_employees/"
//      });

        $("#employee_name").autoSuggest(base_url + "admin_catalogs/users/fn_get_employees/", {resultClick: function(data){ console.log(data); }});
      
      
      // se inicializa la clase pasando los parametros de configuracion
      module_users.init({
            
            items: {
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form',
                  select_fck: 'employee_id'
            },
                  
            permits: permits,
            
            url:{
                  add: base_url + 'admin_catalogs/users/add',
                  view: base_url + 'admin_catalogs/users/view',
                  edit: base_url + 'admin_catalogs/users/edit',
                  del: base_url + 'admin_catalogs/users/delete'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar el usuario.',
                  edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el usuario.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el usuario.',
                  
                  del_confirm:'Estas seguro de querer eliminar este usuario.',
                  del_success:'El usuarios ha sido eliminado con exito.'
            },

            no_uppercase: ['username', 'password', 'passconf']         
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table").catalogoTable2({
            
            title: 'Tabla de Empleados',
            load_url: base_url + 'admin_catalogs/users/grid_paginate',
         
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
            
                  username:{
                        title: 'Nombre de Usuario',
                        width: '43%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'users.description'
                  }, 
                  
                  employee_name:{
                        title: 'Empleado',
                        width: '43%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'users.description'
                  },
                  
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                  Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              module_users.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  },
            
                  Pdf:{
                        title: 'Pdf',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/users/grid_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/users/grid_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                  View:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_users.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_users.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
            }
            
      });
      
      
});