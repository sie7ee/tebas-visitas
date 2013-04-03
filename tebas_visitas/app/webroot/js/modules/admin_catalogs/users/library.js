var module_users = (function(){
      
      /**
       * Objeto typo privado que tendra las opciones de configuracion de la clase que se utilizaran en el proceso de crud
       */
      var _options = {}
      
      
      /**
       * Objeto typo privado que contiene todas las funciones crud en este caso sufrio ligeramente unas modificaciones
       * debido a la utilizacion del plugin de autocompletado
       */
      var _crud = {
            
            /**
             * Funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
             * 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            add_form_show: function(obj_plugin){
                  
                  var self = this;
                  
                  utils_library.fck_autocomplete.removeAllItems(_options.items.form, _options.items.select_fck);// esto se agrego por el uso del plugin
                  utils_library.form.validation_engine(_options.items.form);
                  
                  $('#' + _options.items.div_form).dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Nuevo',
                        width: '450px',
                        buttons: [{
                              text: 'Guardar',
                              click: function () {
                                          
                                    if(utils_library.form.validation_save_click(_options.items.form)){
                                                
                                          self.add_save_submit(obj_plugin);
                                    } 
                              }
                        },{
                              text: 'Cerrar',
                              click: function () {
                                    
                                    utils_library.form.validation_clear_alerts(_options.items.form);
                                    utils_library.form.clear(_options.items.form);
                                    $('#' + _options.items.div_form).dialog('close');
                              }
                        }],
                        close: function(){
                              
                              utils_library.form.validation_clear_alerts(_options.items.form);
                              utils_library.form.clear(_options.items.form);
                        }
                  });
                 
                  
            },
            
            /**
             * Funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
             * 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            add_save_submit: function(obj_plugin){
                  
                  utils_library.form.prepare_data(_options.items.form, _options.no_uppercase);
                  
                  var self = this;
                  var dataForm = $('#' + _options.items.form).serialize();
                  
                  $.ajax({
                        url: _options.url.add,
                        type:'POST',
                        data: dataForm,
                        async: false,
                        dataType: 'json',
                        success: function(data){ 
                              
                              self.add_save_success(obj_plugin, data);
                        },
                        error: function(){
                              
                              $.msgbox(_options.msg.add_error);  
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
             * al momento de ralizar el alta del nuevo registro
             * 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
            add_save_success: function(obj_plugin, data){
                  
                  var div_form = $('#' + _options.items.div_form);
                  
                  obj_plugin._$mainContainer.empty();
                  obj_plugin._create();
                  
                  $.msgbox(data.msg);
                  
                  if(data.success){
                                          
                        utils_library.form.validation_clear_alerts(_options.items.form);
                        utils_library.form.clear(_options.items.form);
                        div_form.dialog('close');
                  }
            },
            
            /**
             * Funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * 
             * @param id identificador del registro del cual se traera la informacion requerida
             */
            view_load_data: function(id){
                  
                  $.ajax({
                        url: _options.url.view,
                        type:'POST',
                        data:'id='+id,
                        dataType:'json',
                        async: false,
                        success: function(data){ 
                              
                              utils_library.fck_autocomplete.removeAllItems(_options.items.form, _options.items.select_fck);// esto se agrego por el uso del plugin
                              utils_library.fck_autocomplete.load_fck(data.data,  _options.items.form, _options.items.select_fck);// esto se agrego por el uso del plugin
                              utils_library.form.load_data(data.data[0],  _options.items.form);
                        },
                        error: function(){
                              $.msgbox(_options.msg.view_error);  
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
             * la informacion cargada del registro a ver
             * 
             * @param id identificador del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            view_form_show: function(id, obj_plugin){
                  
                  var self = this;  
                  var buttons = [];
                  var div_form = $('#' + _options.items.div_form);
                  
                  if(_options.permits.edit){
                        buttons = [{
                              text: 'Editar',
                              click: function () {
                                    
                                    if(utils_library.form.validation_save_click(_options.items.form)){
                                          self.edit_save(id, obj_plugin);
                                    }
                              }
                        }];
                  }
                   
                  utils_library.form.validation_engine(_options.items.form);
                  
                  div_form.dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Ver',
                        width: '450px',
                        buttons: buttons,
                        close: function(){
                              utils_library.form.validation_clear_alerts(_options.items.form);
                              utils_library.form.clear(_options.items.form);
                        }
                  });
            },
            
            /**
             * Function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
             * 
             * @param id identificar del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            edit_save: function(id, obj_plugin){
                  
                  utils_library.form.prepare_data(_options.items.form, _options.no_uppercase);
                  
                  var self = this;
                  var form = $('#' + _options.items.form);
                  var dataForm = form.serialize();
                  
                  $.ajax({
                        url: _options.url.edit,
                        type:'POST',
                        data: 'id='+id+'&'+dataForm,
                        async: false,
                        dataType:'json',
                        success: function(data){ 
                              
                              self.edit_success(obj_plugin, data);
                        },
                        error: function(){
                              
                              $.msgbox(_options.msg.edit_error);  
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
             * al momento de editar el registro
             * 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta              
             */
            edit_success: function(obj_plugin, data){
                  
                 var div_form = $('#' + _options.items.div_form);

                 $.msgbox(data.msg);  
                  
                 if(data.success){

                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                        
                        utils_library.form.validation_clear_alerts(_options.items.form);
                        utils_library.form.clear(_options.items.form);
                        div_form.dialog('close');
                  }
            },
            
            /**
             * Funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
             * 
             * @param id identificador del registro a eliminar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            del: function(id, obj_plugin){
                  
                  var self = this;
                  var div_main = $('#' + _options.items.div_main);
                  var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                  div.text(_options.msg.del_confirm).dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Atencion',
                        buttons: [{
                              text: 'Aceptar',
                              click: function () {
                                    div.dialog('close');
                                    div.remove();
                                    self.delete_submit(id, obj_plugin);
                              }
                        },{
                              text: 'Cancelar',
                              click: function () {
                                    div.dialog('close');
                                    div.remove();
                              }
                        }]
                  });
            },
            
            
            /**
             * Funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
             * 
             * @param id identificador del registro a eliminar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            delete_submit: function(id, obj_plugin){
                  
                  var self = this;                 

                  $.ajax({
                        url: _options.url.del,
                        type:'POST',
                        data: 'id='+id,
                        async: false,
                        dataType:'json',
                        success: function(data){ 
                              
                              self.delete_submit_success(obj_plugin, data);
                        },
                        error: function(){
                              $.msgbox(_options.msg.del_error);  
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de mostrar un mensaje de success 
             * 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
            delete_submit_success: function(obj_plugin, data){
                  
                  $.msgbox(data.msg);  
                  
                  if(data.success){
                        
                       obj_plugin._$mainContainer.empty();
                       obj_plugin._create();
                  } 
                  
            }
      }// finaliza proceso crud
      
      
      // se retorna un objeto typo publico para poder acceder a las funciones siguientes
      return {
            
            /**
             * Funcion que se encarga de inizializar la clase 
             * 
             * @param params objeto json que contiene la configuracion de la clase
             */
            init: function(params){
                  
                  _options = params;
            },
            
            /**
             * Funcion publica que se encarga de iniciar el proceso crud de nuevo
             * 
             * @param obj_click objeto del boton que sele dio click
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            add: function(obj_click, obj_plugin){
                  
                  _crud.add_form_show(obj_plugin);
            },
            
            /**
             * Funcion publica que se encarga de iniciar el proceso de ver un registro tambien muestra el boton de
             * editar para que el usuario edite el registro siempre y cuando tenga los permisos necesarios
             * 
             * @param params objeto json con los parametros necesarios para el proceso de ver
             *              -id identificador del registro a aver
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            view: function(params){
                  
                  _crud.view_load_data(params.id);
                  _crud.view_form_show(params.id, params.obj_plugin);  
            },
            
            /**
             * Funcion publica que e encarga de iniciar el proceso de eliminar un registro
             * 
             * @param params objeto json con los parametros necesarios para el proceso de eliminar
             *              -id identificador del registro a aver
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            del: function(params){
                  
                  _crud.del(params.id, params.obj_plugin);
            }
      }
})();