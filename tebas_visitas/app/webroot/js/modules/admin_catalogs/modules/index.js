$(document).ready(function(){

     var base_url = document.location.protocol + '//' + document.location.host + '/';
     var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/modules/fn_load_permits'); // se cargan los permisos
      
     // agregamos las clases css que ocupa el plugin validateengine para la validacion de los formularios
     $('#catalogo-form').find('#name').addClass('validate[required]');
     $('#catalogo-form').find('#sys_name').addClass('validate[required]');
     $('#catalogo-form').find('#description').addClass('validate[required]');
     $('#catalogo-form').find('#is_father').addClass('validate[required]');
     $('#catalogo-form').find('#father_id').addClass('validate[required]');
     $('#catalogo-form').find('#order').addClass('validate[required]');
     
     $('#file_upload').uploadify({
            uploader : base_url + 'js/plugins/uploadify/uploadify.swf'
            , script : base_url + 'admin_catalogs/modules/fn_do_upload'
            , width : 120
            , height : 30
            , cancelImg : base_url + 'js/plugins/uploadify/cancel.png'
            , removeCompleted : false
            , auto : true
            , onComplete : function(event, ID, fileObj, response, data){
                  
                  var res = $.parseJSON(response);
                  
                  if(res.success){
                        
                        $('#info_icon').val(res.data.file_name);
                        
                  } else {
                        
                        $.msgbox(res.msg);  
                  }
            }
            , onCancel: function(){
                  
                  var info_icon = $('#info_icon').val();
                  
                  $.ajax({
                        url: base_url + 'admin_catalogs/modules/fn_delete_icon',
                        type:'POST',
                        data: 'info_icon=' + info_icon
                  });
            }
            , onError : function (event, ID, fileObj, response, errorObj) {
                                   
            }
     });
      
      // se inicializa la clase pasando los parametros de configuracion
      crud_library.init({
            
            items: {
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form',
                  
                  div_form_actions: 'catalogo-div-form-actions',
                  form_actions: 'catalogo-form-actions'
            },
            
            permits: permits,
            
            config_dialog:{
                  
                  width:'436',
                  height:'620'
            },
            
            url:{
                  add: base_url + 'admin_catalogs/modules/add',
                  view: base_url + 'admin_catalogs/modules/view',
                  edit: base_url + 'admin_catalogs/modules/edit',
                  del: base_url + 'admin_catalogs/modules/delete',
                  
                  definir_add: base_url + 'admin_catalogs/modules/definir_add',
                  
                  actions_load: base_url + 'admin_catalogs/modules/actions_load',
                  actions_edit: base_url + 'admin_catalogs/modules/actions_edit',
                  actions_del: base_url + 'admin_catalogs/modules/actions_del'
            },

            msg:{
                  add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar el modulo.',
                  edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el modulo.',
                  view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el modulo.',
                  del_error: 'Se sucito un error al tratar de conectar con el servidor al momento de eliminar el modulo.',
                  
                  del_confirm:'Estas seguro de querer eliminar este modulo.',
                  del_success:'El modulo ha sido eliminado con exito.'
            },
            
            no_uppercase:['sys_name']
      });
      
      module_modules.init({
            
            items: {
                  div_main: 'library',
                  div_form: 'catalogo-div-form',
                  form: 'catalogo-form',
                  
                  div_form_actions: 'catalogo-div-form-actions',
                  form_actions: 'catalogo-form-actions'
            },
            
            permits: permits,
            
            url:{ 
                  definir_add: base_url + 'admin_catalogs/modules/definir_add',
                  
                  actions_load: base_url + 'admin_catalogs/modules/actions_load',
                  actions_edit: base_url + 'admin_catalogs/modules/actions_edit',
                  actions_del: base_url + 'admin_catalogs/modules/actions_del'
            },
            
            no_uppercase:['sys_name']
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table").catalogoTable2({
            
            title: 'Tabla de Modulos',
            load_url: base_url + 'admin_catalogs/modules/grid_paginate',
            
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            
            columns: {
            
                  name:{
                        title: 'Nombre del Modulo',
                        width: '25%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'modules.name'
                  }, 
                  sys_name:{
                        title: 'Nombre del Systema',
                        width: '25%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'modules.sys_name'
                  },
                  
                  father_name: {
                        title: 'Padre',
                        width: '25%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'modules.father_name'
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
                              
                              window.open(base_url + 'admin_catalogs/modules/grid_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/modules/grid_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                   Definir:{
                        title:'Definir',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_modules.definir_add({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                   View_actions:{
                        title:'Acciones',
                        fn: function(id, obj_click, obj_plugin){
                              
                              module_modules.actions_view({
                                    id: id,
                                    obj_click: obj_click,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
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

      
      $('#is_father').change(function(){
            
            var value = $(this).val();
            var father_id = $('#father_id');
            
            if(value == 'false'){
                 
                  father_id.removeAttr('readonly');
                  
            } else {

                  father_id.attr('readonly', 'readonly');
                  father_id.find('option:eq(1)').attr('selected', 'selected');
            }
      });
      
});