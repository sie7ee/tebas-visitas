/**
 * module_companies
 * 
 * Objeto en javascript encargado del proceso de la funcionalidad crud del modulo empresas
 * 
 * @date 23/11/2012
 * @author Gustavo Avila Medina <gustavo_bam87@hotmail.com>
 */
var module_modules = (function(){
      
      /**
       * Objeto typo privado que tendra las opciones de configuracion de la clase que se utilizaran en el proceso de crud
       */
      var _options = {}
      
      
      
      var _definir = {
            
            /**
             * Funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
             * 
             * @param id identificador del modulo al caul se le agregaran las acciones que tendra 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            add_form_show: function(id, obj_plugin){
                  
                  var self = this;

                  utils_library.form.validation_engine(_options.items.form_actions);
                  
                  $("#" + _options.items.form_actions).find("#sys_name").removeAttr('disabled');
                  
                  $('#' + _options.items.div_form_actions).dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Nueva Accion',
                        width: '350px',
                        buttons: [{
                              text: 'Guardar',
                              click: function () {
                                          
                                    if(utils_library.form.validation_save_click(_options.items.form_actions)){
                                                
                                          self.add_save_submit(id, obj_plugin);
                                    } 
                              }
                        },{
                              text: 'Cerrar',
                              click: function () {
                                    
                                    utils_library.form.validation_clear_alerts(_options.items.form_actions);
                                    utils_library.form.clear(_options.items.form_actions);
                                    $('#' + _options.items.div_form_actions).dialog('close');
                              }
                        }],
                        close: function(){
                              
                              utils_library.form.validation_clear_alerts(_options.items.form_actions);
                              utils_library.form.clear(_options.items.form_actions);
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
             * 
             * @param id identificador del modulo al caul se le agregaran las acciones que tendra 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            add_save_submit: function(id, obj_plugin){
                  
                  utils_library.form.prepare_data(_options.items.form, _options.no_uppercase);
                  
                  var self = this;
                  var dataForm = $('#' + _options.items.form_actions).serialize();
                  
                  $.ajax({
                        url: _options.url.definir_add,
                        type:'POST',
                        data: 'module_id='  + id + '&' + dataForm,
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
                  
                  var div_form = $('#' + _options.items.div_form_actions);
                  
                  $.msgbox(data.msg);
                  
                  if(data.success){
                                          
                        utils_library.form.validation_clear_alerts(_options.items.form);
                        utils_library.form.clear(_options.items.form);
                        div_form.dialog('close');
                  }
            }
            
      }// fin funciones definir
      
      
      var _actions = {
            
            module_name: '',
            div_content:{},
            
            load: function(id){
                  
                  var self = this;
                  $.ajax({
                        url: _options.url.actions_load,
                        type:'POST',
                        data:'module_id='+id,
                        dataType:'json',
                        async: false,
                        success: function(data){ 
                              
                              self.html_success(id, data);
                        },
                        error: function(){
                              
                              $.msgbox("Se sucito un problema al tratar de recuperar las acciones para este modulo.");  
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de construir el html para crear la lista ul que contendra a los empleados de la planta
             * y de seleccionar en el check del form los empleados a los cuales seles asignara un rol en particular
             * 
             * @param module_id indentificador del modulo al cual se asignaran las acciones
             * @param request objeto json con los datos arrojados en el query
             */
            html_success: function(module_id, request){
                  
                  var self = this;
                  var div_main = $('#' + _options.items.div_main);
                  
                  // validamos si el query se realizo con exito
                  if(request.success){
                        
                        var div = $('<div></div>').appendTo(div_main);
                        var form = $('<form></form>').attr({
                              id:'form-actions'
                        }).appendTo(div);
                        var ul = $('<ul></ul>').appendTo(form);
                        
                        // recorremos los datos arrojados por el query
                        $.each(request.data, function(index, action){
                              
                              li_action = self.html_li(ul);
                              span_action = self.html_span(li_action);
                              label_action = self.html_label(span_action, action.name, action.sys_name);
                              
                              self.html_a_eliminar(action.id, 'btn btn-primary btn-small', span_action);
                              self.html_a_ver(module_id, action.id, 'btn btn-primary btn-small', span_action);
                        });
                        
                        div.dialog({
                              autoOpen: true,
                              modal: true,
                              title: self.module_name + ' - Acciones',
                              width: 700,
                              height: 'auto',
                              maxHeight: 0,
                              resizable: false,
                              create: function() {
                                    $(this).css("maxHeight", 600);        
                              },
                              position: 'top',
                              buttons: [{
                                    text: 'Cancelar',
                                    click: function () {
                                          div.dialog('close');
                                          div.remove();
                                    }
                              }]
                        });
                        
                        self.div_content = div;
                  } else {
                        $.msgbox(request.msg);        
                  }
            },
            
            /**
             * Funcion que se encarga de crear un lista <ul> html, es usado para crear
             * la lista de acciones
             * 
             * @param li objeto al cual se asignara el elemento <ul>
             * @param addclass clase css que llevara el elemento <ul>
             * @return objeto retorna un objeto o elemento html 
             */
            html_ul: function(li, addclass){
                  
                 return $('<ul></ul>').addClass(addclass).appendTo(li); 
            },
            
             /**
             * Funcion que se encarga de crear un elemento <li> html, es usado para crear
             * la lista de acciones
             * 
             * @param ul objeto al cual se asignara el elemento <li>
             * @return objeto retorna un objeto o elemento html 
             */
            html_li: function(ul){
                  
                 return $('<li></li>').appendTo(ul);
            },
            
             /**
             * Funcion que se encarga de crear un elemento <label> html, es usado para crear
             * la lista de acciones
             * 
             * @param span objeto al cual se asignara el elemento <label>
             * @param name nombre que lleva la accion
             * @param sys_name nombre de sistema de la accion
             * @return objeto retorna un objeto o elemento html 
             */
            html_label: function(span, name, sys_name){
                  
                 return $('<label></label>').text(name + ' - ' + '( '+ sys_name +' )').css('width', '80%').css('cursor', 'pointer').appendTo(span);
            },
            
            /**
             * Funcion que se encarga de crear un elemento <spanl> html, es usado para crear
             * la lista de acciones
             * 
             * @param li objeto al cual se asignara el elemento <span>
             * @return objeto retorna un objeto o elemento html 
             */
            html_span: function(li){
                  
                 return $("<span></span>").addClass('ui-state-default').css('margin-top', '10px').css('padding-left', '10px').css('padding-top', '10px').css('padding-bottom', '10px').css('display', 'block').appendTo(li);
            },
           
           /**
             * Funcion que se encarga de crear un elemento <a> html, es usado para crear
             * la lista de acciones y ademas
             * 
             * @param id identificador de la accion a eliminar
             * @param addclass clase css que sele asignara al elemento <a>
             * @param span elemento html al cual sele asignara el elemento <a>
             * @return objeto retorna un objeto o elemento html 
             */
            html_a_eliminar: function(id, addclass,span){
                  
                  return $('<a></a>').text('Eliminar').addClass(addclass)
                              .css('float', 'right').css('color', '#fff')
                              .css('margin-top', '-20px').css('margin-right', '5px')
                              .appendTo(span).click(function(){
                                    
                                    var a = $(this);
                                    
                                      $.ajax({
                                          url: _options.url.actions_del,
                                          type:'POST',
                                          data:'id='+id,
                                          dataType:'json',
                                          async: false,
                                          success: function(data){ 

                                                if(data.success){
                                                      
                                                      var li = a.parent().parent();
                                                      li.remove();
                                                      
                                                } else {
                                                      
                                                      $.msgbox(data.msg);  
                                                }
                                          },
                                          error: function(){

                                                $.msgbox("Se sucito un problema al tratar de recuperar las acciones para este modulo.");  
                                          }
                                    }); 
                              });
            },
            
             /**
             * Funcion que se encarga de crear un elemento <a> html, es usado para crear
             * la lista de acciones y ademas se encarga de mostrar la informacion de una accion determinada
             * 
             * @param module_id identificador del modulo al que pertenece la accion
             * @param id identificador de la accion a eliminar
             * @param addclass calse csss que se le asignara al alemento <a>
             * @param span objeto o elemento html que se le asignara el elemento <a>
             * @return objeto retorna un objeto o elemento html 
             */
             html_a_ver: function(module_id, id,addclass,span){
                  
                  var self = this;
                  return $('<a></a>').text('Ver').addClass(addclass).attr('href', id)
                              .css('float', 'right').css('color', '#fff')
                              .css('margin-top', '-20px').css('margin-right', '5px')
                              .appendTo(span).click(function(e){
                                    
                                    e.preventDefault();
                                    self.view_load_data(id);
                                    self.view_form_show(module_id, id);
                              });
            },
            
            /**
             * Funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * 
             * @param id identificador del registro del cual se traera la informacion requerida
             */
            view_load_data: function(id){
                  
                  $.ajax({
                        url: _options.url.actions_load,
                        type:'POST',
                        data:'id='+id,
                        dataType:'json',
                        async: false,
                        success: function(data){ 
                              
                              utils_library.form.load_data(data.data[0],  _options.items.form_actions);
                        },
                        error: function(){
                              
                              $.msgbox("Se sucito un problema al tratar de recuperar las acciones para este modulo.");  
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
             * la informacion cargada del registro a ver
             *              
             * @param module_id indentificador del modulo al cual se editara una accion
             * @param id identificador del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            view_form_show: function(module_id, id, obj_plugin){
                  
                  var self = this;  
                  var div_form = $('#' + _options.items.div_form_actions);
                   
                  utils_library.form.validation_engine(_options.items.form_actions);
                  
                  $("#" + _options.items.form_actions).find("#sys_name").attr('disabled', 'disabled');
                  
                  div_form.dialog({
                        autoOpen: true,
                        modal: true,
                        title: self.module_name,
                        width: '350px',
                        buttons: [{
                              text: 'Editar',
                              click: function () {
                                    
                                    if(utils_library.form.validation_save_click(_options.items.form_actions)){
                                          
                                          self.edit_save(module_id, id, obj_plugin);
                                    }
                              }
                        }],
                        close: function(){
                              
                              utils_library.form.validation_clear_alerts(_options.items.form_actions);
                              utils_library.form.clear(_options.items.form_actions);
                        }
                  });
            },
            
            /**
             * Function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
             * 
             * @param module_id indentificador del modulo al cual se editara una accion
             * @param id identificar del registro a editar
             */
            edit_save: function(module_id, id){
                  
                  utils_library.form.prepare_data(_options.items.form, _options.no_uppercase);
                  
                  var self = this;
                  var form = $('#' + _options.items.form_actions);
                  var dataForm = form.serialize();
                  
                  $.ajax({
                        url: _options.url.actions_edit,
                        type:'POST',
                        data: 'id='+id+'&module_id='+module_id+ '&'+dataForm,
                        async: false,
                        dataType:'json',
                        success: function(data){ 
                              
                              self.edit_success(module_id, data);
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
             * @param module_id indentificador del modulo al cual se editara una accion
             * @param data resultado del proceso a editar arrojado por el query
             * @param data obj json retornado por el servidor con el success y mensaje del alta              
             */
            edit_success: function(module_id, data){
                   
                 var div_form = $('#' + _options.items.div_form_actions);

                 $.msgbox(data.msg);  
                  
                  if(data.success){
                        
                        this.div_content.remove();
                        this.load(module_id);
                        
                        utils_library.form.validation_clear_alerts(_options.items.form_actions);
                        utils_library.form.clear(_options.items.form_actions);
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
                        url: _options.url.actions_del,
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
      }// fin funciones actions
      
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
             * Funcion que se encarga de crear una nueva accion
             * 
             * @param params objeto json con los parametros necesarios para el proceso de visualizar una accion
             *              -id identificador del registro a eliminar
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            definir_add: function(params){
                  
                  _definir.add_form_show(params.id, params.obj_plugin);
            },
            
            /**
             * Funcion que se encarga de visualizar una accion determinada
             * 
             * @param params objeto json con los parametros necesarios para el proceso de visualizar una accion
             *              -obj_click objeto o elemento html al cual sele dio click (boton del grid)
             *              -id identificador del registro a eliminar
             */
            actions_view: function(params){
                  
                  var obj = params.obj_click;
                  var module_name = obj.parent().parent().find('td').eq(0).text();
                  
                  _actions.module_name = module_name;
                  _actions.load(params.id);
            },
            
            /** 
             * Funcion publica que e encarga de iniciar el proceso de eliminar una accion
             * 
             * @param params objeto json con los parametros necesarios para el proceso de eliminar
             *              -id identificador del registro a eliminar
             *              -obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
            actions_del: function(params){
                  
                  _actions.del(params.id, params.obj_plugin);
            }
      }
})();