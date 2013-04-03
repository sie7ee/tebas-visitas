$(document).ready(function(){

     var base_url = document.location.protocol + '//' + document.location.host + '/';
     var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/messages/fn_load_permits'); // se cargan los permisos
      
      module_messages.init({
            
            items: {
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form',
                  select_fck: 'address'
            },
            
                  
            permits: permits,
            
            url:{
                  add: base_url + 'admin_catalogs/messages/add',
                  view: base_url + 'admin_catalogs/messages/view',
                  del: base_url + 'admin_catalogs/messages/delete'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de enviar el mensaje.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el mensaje.',
                  del_error:'Se sucito un error al tratar de conectar con el servidor al momento de eliminar el mensaje',
                  
                  del_confirm:'Estas seguro de querer eliminar este mensaje.',
                  del_success:'El mensaje ha sido eliminado con exito.'
            },

            no_uppercase: false       
      });
      
      /**
       * Plugin del autocomplete de empleados a los que se les mandara el mensaje.
       */
      $("#address").fcbkcomplete({
            json_url: base_url + "admin_catalogs/messages/fn_get_employees"
            , addontab: true
            , maxitems: 10
            , input_min_size: 0
            , cache: false
            , width:385
            , select_all_text: "Todos"
            , filter_selected : true
            , display_results:'block'
            , no_items:'No se encontraron Usuarios'
            , heigh: 100
      });
      
      /**
       * Tabla de mensajes recibidos por el usuario.
       */
 $("#catalogo-table-Recibidos").catalogoTable5({
            
            title: 'Tabla de Mensajes Recibidos',
            load_url: base_url + 'admin_catalogs/messages/grid_entrada_paginate',
         
            paginate:{
                  order: 'DESC',
                  campo: 'messages.id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
                  
                  visto:{
                        title: 'Visto',
                        width: '8%',
                        sortable: true,
                        pivot: true
                  },
            
                  title:{
                        title: 'Titulo del Mensaje',
                        width: '27%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'messages.description'
                  },   
                  
                  enviado_por:{
                        title: 'Enviado Por',
                        width: '27%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description'
                  },
                  
                  enviado: {
                        title: 'Fecha Envio',
                        width: '27%',
                        sortable: true,
                        pivot: true
                  },
                  
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
            
                  Pdf:{
                        title: 'Pdf',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/messages/grid_entrada_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/messages/grid_entrada_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                  Ver:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_messages.view_entrada({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_messages.del_entrada({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
                  
                  
            }
            
      });
      
      /**
       * Tabla de mensajes salida por el usuario.
       */
      $("#catalogo-table-salida").catalogoTable5({
            
            title: 'Tabla de Mensajes Enviados',
            load_url: base_url + 'admin_catalogs/messages/grid_salida_paginate',
            permits:{
                  add: true,
                  edit:true,
                  deleted:true,
                  view:true,
                  view_pdf:true ,
                  view_excel:true
            },
         
            paginate:{
                  order: 'DESC',
                  campo: 'messages.id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
                  
                  visto:{
                        title: 'Visto',
                        width: '8%',
                        sortable: true,
                        pivot: true
                  },
            
                   title:{
                        title: 'Titulo del Mensaje',
                        width: '27%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'messages.description'
                  },   
                  
                  enviado_por:{
                        title: 'Enviado Por',
                        width: '27%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description'
                  },
                  
                  enviado: {
                        title: 'Fecha Envio',
                        width: '27%',
                        sortable: true,
                        pivot: true
                  },
                  
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                   Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              module_messages.add(obj_click, obj_plugin);
                        },
                        permit:permits.add
                  },
            
                  Pdf:{
                        title: 'Pdf',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/messages/grid_salida_get_pdf');
                        },
                        permit:permits.pdf_grid
                  },
                  
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/messages/grid_salida_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                  Ver:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_messages.view_salida({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit:permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_messages.del_salida({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
            }   
      });
});