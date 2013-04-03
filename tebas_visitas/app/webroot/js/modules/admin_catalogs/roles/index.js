$(document).ready(function(){

      var base_url = document.location.protocol + '//' + document.location.host + '/';
      var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/roles/fn_load_permits'); // se cargan los permisos
      
     // agregamos las clases css que ocupa el plugin validateengine para la validacion de los formularios
     $('#catalogo-form').find('#name').addClass('validate[required]');
      
      // se inicializa la clase pasando los parametros de configuracion
      crud_library.init({
            
            items: {
                  
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form'
            },
                  
            permits: permits,
            
            config_dialog:{
                  
                  width:'350',
                  height:'200'
            },

            url:{
                  add: base_url + 'admin_catalogs/roles/add',
                  view: base_url + 'admin_catalogs/roles/view',
                  edit: base_url + 'admin_catalogs/roles/edit',
                  del: base_url + 'admin_catalogs/roles/delete'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar el rol.',
                  edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el rol.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el rol.',
                  
                  del_confirm:'Estas seguro de querer eliminar este rol.',
                  del_success:'El rol ha sido eliminado con exito.'
            },

            no_uppercase:false       
      });
      
      module_roles.init({
            
            items: {
                  
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form'
            },
                  
            permits: permits,

            url:{ 
                  definir_get_modules: base_url + 'admin_catalogs/roles/definir_load_modules',
                  definir_add_modules:  base_url + 'admin_catalogs/roles/definir_add_modules',
                  
                  asignar_get_employees: base_url + 'admin_catalogs/roles/asignar_load_employees',
                  asignar_add_employees:  base_url + 'admin_catalogs/roles/asignar_add_employees',
                  
                  exeptions_get: base_url + 'admin_catalogs/roles/excepcion_load',
                  exceptions_add: base_url + 'admin_catalogs/roles/excepcion_add'
            },

            msg:{ 
                  definir_error: 'Se sucito un error al tratar de conectar con el servidor al momento de recuperar los modulos.'
            },

            no_uppercase:false       
      });
      
        // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table").catalogoTable2({
            
            title: 'Tabla de Roles',
            load_url: base_url + 'admin_catalogs/roles/grid_paginate',
            
            permits: permits,
         
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
            
                  name:{
                        title: 'Nombre del Rol',
                        width: '39%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'roles.name'
                  }, 
                  created_date: {
                        title: 'Fecha Creacion',
                        width: '39%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'roles.created_date'
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
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/roles/grid_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/roles/grid_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                  Definir:{
                        title: 'Definir',
                        fn:function(id, obj_click, obj_plugin){
                               module_roles.definir({
                                    id: id,
                                    obj_click: obj_click,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: true
                  },
                  
                  Asignar:{
                        title:'Asignar',
                        fn: function(id, obj_click, obj_plugin){
                             module_roles.asignar({
                                    id: id,
                                    obj_click: obj_click,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: true
                  },
                  
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