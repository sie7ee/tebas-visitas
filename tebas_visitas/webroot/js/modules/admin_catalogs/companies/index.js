$(document).ready(function(){

     var base_url = document.location.protocol + '//' + document.location.host + '/';
     var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/companies/fn_load_permits'); // se cargan los permisos
      
     // agregamos las clases css que ocupa el plugin validateengine para la validacion de los formularios
     $('#catalogo-form').find('#description').addClass('validate[required]');
      
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
                  add: base_url + 'admin_catalogs/companies/add',
                  view: base_url + 'admin_catalogs/companies/view',
                  edit: base_url + 'admin_catalogs/companies/edit',
                  del: base_url + 'admin_catalogs/companies/delete'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar la empresa.',
                  edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar la empresa.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver la empresa.',
                  del_error: 'Se sucito un error al tratar de conectar con el servidor al momento de eliminar la empresa.',
                  
                  del_confirm:'Estas seguro de querer eliminar la empresa.',
                  del_success:'La empresa ha sido eliminado con exito.'
            },
            
            no_uppercase:false
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table").catalogoTable4({
            
            title: 'Tabla de Empresas',
            load_url: base_url + 'admin_catalogs/companies/grid_paginate',
            
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true,
                  fn:function(){}
            },
            
            columns: {
            
                  description:{
                        title: 'Descripcion de la empresa',
                        width: '45%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description',
                        type:'autocomplete',
                        validations:'numeric',
                        source: base_url + 'admin_catalogs/companies/fn_load_options'
//                        events:{
//                              
//                              change:function(){
//                                    
//                                    var id = $(this).attr('data-role-id');
//                                    var value = $(this).val();
//                                    
//                                    $.ajax({
//                                         url: base_url + 'admin_catalogs/companies/edit',
//                                         data:{
//                                               id:id,
//                                               description:value
//                                         },
//                                         dataType:'json',
//                                         type:'POST',
//                                         success:function(response){
//                                               
//                                               console.log(response);
//                                         },
//                                         error:function(){
//                                               alert("error");
//                                         }
//                                    });
//                              }
//                        }
                  }, 
                  created_date: {
                        title: 'Fecha Creacion',
                        width: '45%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.created_date',
                        type:'date',
                        events:{
                              
                              change:function(){
                                    
                                    var id = $(this).attr('data-role-id');
                                    var value = $(this).val();
                                    
                                    $.ajax({
                                         url: base_url + 'admin_catalogs/companies/edit',
                                         data:{
                                               id:id,
                                               description:value
                                         },
                                         dataType:'json',
                                         type:'POST',
                                         success:function(response){
                                               
                                               console.log(response);
                                         },
                                         error:function(){
                                               alert("error");
                                         }
                                    });
                              }
                        }
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
                              
                              window.open(base_url + 'admin_catalogs/companies/grid_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/companies/grid_get_excel');
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