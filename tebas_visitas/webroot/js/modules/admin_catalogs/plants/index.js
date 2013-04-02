$(document).ready(function(){

      var base_url = document.location.protocol + '//' + document.location.host + '/';
      var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/plants/fn_load_permits'); // se cargan los permisos
      
      // agregamos las clases css que ocupa el plugin validateengine para la validacion de los formularios
     $('#catalogo-form').find('#description').addClass('validate[required]');
      
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
                  add: base_url + 'admin_catalogs/plants/add',
                  view: base_url + 'admin_catalogs/plants/view',
                  edit: base_url + 'admin_catalogs/plants/edit',
                  del: base_url + 'admin_catalogs/plants/delete'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar la planta.',
                  edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar la planta.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver la planta.',
                  
                  del_confirm:'Estas seguro de querer eliminar esta planta.',
                  del_success:'La planta ha sido eliminado con exito.'
            },
            
            no_uppercase:false

                     
      });
      
      // se inicializa la configuracion del plugin catalogoTable  
      $("#catalogo-table").catalogoTable2({
            
            title: 'Tabla de Empresas',
            load_url: base_url + 'admin_catalogs/plants/grid_paginate',
            permits:permits,
         
            paginate:{
                  order: 'DESC',
                  campo: 'plants.id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
            
                  description:{
                        title: 'Descripcion de la planta',
                        width: '35%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'plants.description'
                  },          
                  description_company:{
                        title: 'Descripcion de la empresa',
                        width: '35%',
                        sortable: true,
                        pivot: false,
                        pivot_title: 'companies.description'
                  },
                  created_date: {
                        title: 'Fecha Creacion',
                        width: '20%',
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
                              
                              crud_library.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  },
            
                  Pdf:{
                        title: 'Pdf',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/plants/grid_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/plants/grid_get_excel');
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