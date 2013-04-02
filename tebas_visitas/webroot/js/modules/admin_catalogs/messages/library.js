/**
 * Objeto en javascript encargado del proceso de la funcionalidad crud del modulo de mensajeria interna
 * 
 * @date 23/11/2012
 * @author Gustavo Avila Medina <gustavo_bam87@hotmail.com>
 */
var module_messages = (function(){
      
      /**
       * Objeto typo privado que tendra las opciones de configuracion de la clase que se utilizaran en el proceso de crud
       * en la bandeja de entrada y en la bandeja de salida
       */
      var _options = {}
      
      /**
       * Objeto typo privado que contiene todas las funciones crud para el proceso de la bandeja de salida
       * en este caso sufrio ligeramente unas modificaciones debido a la utilizacion del plugin de autocompletado
       */
      var _salida = {
            
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
                              text: 'Enviar',
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
             * Funcion que se encarga de realizar la peticion ajax para guardar los nuevo mensaje
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
             * Funcion que se encarga de mandar un mensaje de success al usuario despues de aver guardado el mensaje en la bandeja de salida
             * 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
           add_save_success: function(obj_plugin, data){
                 
//                  var div_form = $('#' + _options.items.div_form);
                  
//                  obj_plugin._$mainContainer.empty();
//                  obj_plugin._create();
                  
//                  $.msgbox(data.msg);
                  
                  if(data.success){
                        
                        $("#catalogo-table-salida").catalogoTable5('load');
                                       
                          //window.location.reload(true);             
//                        utils_library.form.validation_clear_alerts(_options.items.form);
//                        utils_library.form.clear(_options.items.form);
//                        div_form.dialog('close');
                  }
            },
            
            /**
             * Funcion que se encarga de recuperar los datos del mensaje
             * 
             * @param id Identificador del mensaje del cual se traera la informacion requerida
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
                              utils_library.fck_autocomplete.load_fck(data.address,  _options.items.form, _options.items.select_fck);// esto se agrego por el uso del plugin
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
             * @param id identificador del mensaje a ver
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            view_form_show: function(id, obj_plugin){
                  
                  var self = this;  
                  var div_form = $('#' + _options.items.div_form);
                   
                  utils_library.form.validation_engine(_options.items.form);
                  
                  div_form.dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Ver',
                        width: '450px',
                        buttons: [{
                              text: 'Reenviar',
                              click: function () {
                                    
                                  if(utils_library.form.validation_save_click(_options.items.form)){
                                        _salida.add_save_submit(obj_plugin);
                                        div_form.dialog('close');
                                  }
                                   
                              }
                        }],
                        close: function(){
                              utils_library.form.validation_clear_alerts(_options.items.form);
                              utils_library.form.clear(_options.items.form);
                        }
                  });
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
                        data: {
                              id:id,
                              type:'Salida'
                        },
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
      }// fin proceso de enviados
      
      /**
       * Objeto typo privado que contiene todas las funciones crud para el proceso de mensajes recibidos
       * en este caso sufrio ligeramente unas modificaciones debido a la utilizacion del plugin de autocompletado
       */
      var _entrada = {
            
            /**
             * Funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * 
             * @param id identificador del registro del cual se traera la informacion requerida
             */
            view_load_data: function(id){
                  
                  $.ajax({
                        url: _options.url.view,
                        type:'POST',
                        data:'id='+id + '&type=Recibidos',
                        dataType:'json',
                        async: false,
                        success: function(data){ 
                              utils_library.fck_autocomplete.removeAllItems(_options.items.form, _options.items.select_fck);// esto se agrego por el uso del plugin
                              utils_library.fck_autocomplete.load_fck(data.address,  _options.items.form, _options.items.select_fck);// esto se agrego por el uso del plugin
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
             * @param id identificador del registro 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            view_form_show: function(id, obj_plugin){
                  
                  var div_form = $('#' + _options.items.div_form);
                   
                  utils_library.form.validation_engine(_options.items.form);
                  
//                  obj_plugin._$mainContainer.empty();
//                  obj_plugin._create();
//                  
                  div_form.dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Ver',
                        width: '450px',
                        buttons: [{
                              text: 'Responder',
                              click: function () {
                                    
                                  if(utils_library.form.validation_save_click(_options.items.form)){
                                        _salida.add_save_submit(obj_plugin);
                                        div_form.dialog('close');
                                        //window.location.reload();
                                  }
                              }
                        }],
                        close: function(){
                              utils_library.form.validation_clear_alerts(_options.items.form);
                              utils_library.form.clear(_options.items.form);
                        }
                  });
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
      }// fin proceso recibidos
      
      
      return {
            
            /**
             * Funcion que se encarga de inizializar la clase 
             * 
             * @access public
             * @param params objeto json que contiene la configuracion de la clase
             * @return void no retonra ningun valor
             */
            init: function(params){
                  
                  _options = params;
            },
            
            /**
             * Funcion publica que se encarga de iniciar el proceso para enviar nuevo mensaje a un empleado
             * 
             * @access public 
             * @param obj_click objeto del boton que sele dio click
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @return void no retorna ningun valor
             */
            add: function(obj_click, obj_plugin){
                  
                  _salida.add_form_show(obj_plugin);
            },
            
             /**
             * Funcion publica que se encarga de iniciar el proceso de ver un nuevo mensaje en la bandeja de salida
             * enviado por el empleado, tambien muestra el boton de reenviar para que el usuario pueda volver a mandar el mismo mensaje
             * al mismo o diferentes destinatarios
             * 
             * @access public
             * @param params objeto json con los parametros necesarios para el proceso de ver
             *              -id identificador del mensaje a aver
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @return void no retorna ningun valor
             */
            view_salida: function(params){
                  
                  _salida.view_load_data(params.id);
                  _salida.view_form_show(params.id, params.obj_plugin);  
            },
            
            /**
             * Funcion que se encarga de eliminar un mensaje en la bandeja de salida 
             * 
             * @access public
             * @params objeto json con los parametros necesarios para el proceso de ver
             *              -id identificador del mensaje a eliminar
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @return void no retorna ningun valor             
             */
            del_salida: function(params){
                  
                  _salida.del(params.id, params.obj_plugin);
            },
            
            /**
             * Funcion publica que se encarga de iniciar el proceso de ver un mensaje recibido tambien muestra el boton de
             * responder para contestar el mensaje al empleado que lo envio
             * 
             * @param params objeto json con los parametros necesarios para el proceso de ver
             *              -id identificador del mensaje a ver
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            view_entrada: function(params){
                  
                  _entrada.view_load_data(params.id, params.obj_plugin);
                  _entrada.view_form_show(params.id, params.obj_plugin);  
            },
            
            /**
             * Funcion que se encarga de eliminar un mensaje en la bandeja de entrada o mensajes recibidos
             * 
             * @params objeto json con los parametros necesarios para el proceso de ver
             *              -id identificador del mensaje a eliminar
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            del_entrada: function(params){
                  
                  _entrada.del(params.id, params.obj_plugin);
            }
      }
})();