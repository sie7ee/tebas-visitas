/**
 * install_modules
 * 
 * Objeto tipo json que se encarga de la funcionalidad de el proceso de instalacion y configuracion del sistema
 * para su correcto funcionamiento
 * 
 * @date
 */
var install_module = (function(){
      
      var _options = {}
      var _base_url = document.location.protocol + '//' + document.location.host + '/';
      var _cbox = {
            
            change: function(formulario, url_plants, load_employees, url_employees){
                  
                  var self = this;
                  var form = $("#" + formulario);
                  var company = form.find('#company_id');
                  var plant = form.find('#plant_id');
                  var employees = form.find('#employee_id');
                  var data = '';
                  
                  company.change(function(){
                        
                        if(company.val() == ''){
                              plant.empty();
                              
                              if(typeof(load_employees) != 'undefined' && load_employees){
                                    employees.empty();
                              }
                              
                        } else {
                              data = 'company_id=' + company.val(); 
                        
                              plant.empty();
                              self.load(data, plant, url_plants);
                        }
                        
                  });
                  
                  
                  if(typeof(load_employees) != 'undefined' && load_employees){
                        
                        employees.empty();
                        
                        plant.change(function(){
                              data = 'company_id=' + (company.val()) + '&plant_id=' + (plant.val());
                              var employee = form.find('#employee_id');
                              
                              employee.empty();
                              self.load(data, employees, url_employees);
                        });
                  }
                  
                  
            },
            
            load: function(data, obj_cbox, url){
                  
                  var self = this;
                  
                  $.ajax({
                        url: url,
                        type:'POST',
                        data: data,
                        async: false,
                        dataType: 'json',
                        success: function(data){ 
                              
                              self.options(obj_cbox, data);
                        },
                        error: function(){
                              
                              console.log("error al cargar algun select");     
                        }
                  });
            },
            
            options: function(obj_cbox, data){
                  
                  $('<option></option>').val('').text('-Seleccione-').appendTo(obj_cbox);
                  if(data.success){

                        $.each(data.data, function(i, value){
                              
                              $('<option></option>').val(i).text(value).appendTo(obj_cbox);
                        });
                  } 
            }
      }
      
      return {
            
            init: function(params){
                  
                  _options = params;
            },
            
            companies: {
                  
                  /**
                   * @name add
                   * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  add: function(obj_click, obj_plugin){
                  
                        var self = this;

                        utils_library.form.validation_engine(_options.companies.items.form);
                  
                        $('#' + _options.companies.items.div_form).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: '350px',
                              buttons: [{
                                    text: 'Guardar',
                                    click: function () {
                                          
                                          if(utils_library.form.validation_save_click(_options.companies.items.form)){

                                                self.add_save_submit(obj_plugin);
                                          } 
                                    }
                              },{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          utils_library.form.validation_clear_alerts(_options.companies.items.form);
                                          utils_library.form.clear(_options.companies.items.form);
                                          $('#' + _options.companies.items.div_form).dialog('close');
                                    }
                              }],
                              close: function(){
                              
                                    utils_library.form.validation_clear_alerts(_options.companies.items.form);
                                    utils_library.form.clear(_options.companies.items.form);
                              }
                        });
                 
                  
                  },
            
                  /**
                   * @name add_save_submit
                   * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  add_save_submit: function(obj_plugin){
                  
                        utils_library.form.prepare_data(_options.companies.items.form, _options.companies.no_uppercase);
                  
                        var self = this;
                        var dataForm = $('#' + _options.companies.items.form).serialize();
                  
                        $.ajax({
                              url: _options.companies.url.add,
                              type:'POST',
                              data: dataForm,
                              async: false,
                              dataType: 'json',
                              success: function(data){ 
                              
                                    self.add_save_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.companies.msg.add_error);  
                              }
                        });
                  },
            
                  /**
                   * @name add_save_success
                   * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
                   *              al momento de ralizar el alta del nuevo registro
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   * @param data obj json retornado por el servidor con el success y mensaje del alta 
                   */
                  add_save_success: function(obj_plugin, data){
                  
                        var div_main = $('#' + _options.companies.items.div_main);
                        var div_form = $('#' + _options.companies.items.div_form);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                  
                        div.text(data.msg).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion !',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          div.dialog('close');
                                          div.remove();
                                    
                                          if(data.success){
                                          
                                                utils_library.form.validation_clear_alerts(_options.companies.items.form);
                                                utils_library.form.clear(_options.companies.items.form);
                                                div_form.dialog('close');
                                          }
                                    }
                              }]
                        });
                  },
            
                  /**
                   * @name view
                   * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
                   * @param id identificador del registro del cual se traera la informacion requerida
                   */
                  view: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        
                        $.ajax({
                              url: _options.companies.url.view,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                              
                                    utils_library.form.load_data(data.data[0],  _options.companies.items.form);
                                    self.view_form_show(id, obj_plugin);
                              },
                              error: function(){
                                    $.msgbox(_options.companies.msg.view_error);  
                              }
                        });
                  },
            
                  /**
                   * @name view_form_show
                   * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
                   *              la informacion cargada del registro a ver
                   * @param id identificador del registro a editar
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  view_form_show: function(id, obj_plugin){
                  
                        var self = this;  
                        var buttons = [];
                        var div_form = $('#' + _options.companies.items.div_form);
                  
                        if(_options.permits.edit){
                              buttons = [{
                                    text: 'Editar',
                                    click: function () {
                                    
                                          if(utils_library.form.validation_save_click(_options.companies.items.form)){
                                                self.edit_save(id, obj_plugin);
                                                div_form.dialog('close');
                                          }
                                    }
                              }];
                        }
                   
                        utils_library.form.validation_engine(_options.companies.items.form);
                  
                        div_form.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Ver',
                              width: '350px',
                              buttons: buttons,
                              close: function(){
                                    utils_library.form.validation_clear_alerts(_options.companies.items.form);
                                    utils_library.form.clear(_options.companies.items.form);
                              }
                        });
                  },
            
                  /**
                   * @name edit_save
                   * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
                   * @param id identificar del registro a editar
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  edit_save: function(id, obj_plugin){
                  
                        utils_library.form.prepare_data(_options.companies.items.form, _options.companies.no_uppercase);
                  
                        var self = this;
                        var form = $('#' + _options.companies.items.form);
                        var dataForm = form.serialize();
                  
                        $.ajax({
                              url: _options.companies.url.edit,
                              type:'POST',
                              data: 'id='+id+'&'+dataForm,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.edit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.companies.msg.edit_error);  
                              }
                        });
                  },
            
                  /**
                   * @name edit_success
                   * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
                   *              al momento de editar el registro
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   * @param data obj json retornado por el servidor con el success y mensaje del alta              
                   */
                  edit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.companies.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }],
                                    close: function(){
                                          utils_library.form.validation_clear_alerts(_options.companies.items.form);
                                          utils_library.form.clear(_options.companies.items.form);
                                    }
                              });
                        } else {
                              $.msgbox(data.msg);  
                        }
                  },
            
                  /**
                   * @name del
                   * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
                   * @param id identificador del registro a eliminar
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  del: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var div_main = $('#' + _options.companies.items.div_main);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        div.text(_options.companies.msg.del_confirm).dialog({
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
                   * @name delete_submit
                   * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
                   * @param id identificador del registro a eliminar
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  delete_submit: function(id, obj_plugin){
                  
                        var self = this;                 

                        $.ajax({
                              url: _options.companies.url.del,
                              type:'POST',
                              data: 'id='+id,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.delete_submit_success(obj_plugin, data);
                              },
                              error: function(){
                                    $.msgbox(_options.companies.msg.del_error);  
                              }
                        });
                  },
            
                  /**
                   * @name delete_submit_success
                   * @description funcion que se encarga de mostrar un mensaje de success 
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   * @param data obj json retornado por el servidor con el success y mensaje del alta 
                   */
                  delete_submit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.companies.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                        
                              div.text('Registro Eliminado').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }]
                              });
                        } else {
                        
                              $.msgbox(data.msg);  
                        } 
                  
                  }
            }, // fin del proceso de empresas
            
            plants:{
                  
                  /**
             * @name add
             * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  add: function(obj_click, obj_plugin){
                  
                        var self = this;

                        utils_library.form.validation_engine(_options.plants.items.form);
                  
                        $('#' + _options.plants.items.div_form).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: '350px',
                              buttons: [{
                                    text: 'Guardar',
                                    click: function () {
                                          
                                          if(utils_library.form.validation_save_click(_options.plants.items.form)){
                                                
                                                self.add_save_submit(obj_plugin);
                                          } 
                                    }
                              },{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          utils_library.form.validation_clear_alerts(_options.plants.items.form);
                                          utils_library.form.clear(_options.plants.items.form);
                                          $('#' + _options.plants.items.div_form).dialog('close');
                                    }
                              }],
                              close: function(){
                              
                                    utils_library.form.validation_clear_alerts(_options.plants.items.form);
                                    utils_library.form.clear(_options.plants.items.form);
                              }
                        });
                 
                  
                  },
            
                  /**
             * @name add_save_submit
             * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  add_save_submit: function(obj_plugin){
                  
                        utils_library.form.prepare_data(_options.plants.items.form, _options.plants.no_uppercase);
                  
                        var self = this;
                        var dataForm = $('#' + _options.plants.items.form).serialize();
                  
                        $.ajax({
                              url: _options.plants.url.add,
                              type:'POST',
                              data: dataForm,
                              async: false,
                              dataType: 'json',
                              success: function(data){ 
                              
                                    self.add_save_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.plants.msg.add_error);  
                              }
                        });
                  },
            
                  /**
             * @name add_save_success
             * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
             *              al momento de ralizar el alta del nuevo registro
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
                  add_save_success: function(obj_plugin, data){
                  
                        var div_main = $('#' + _options.plants.items.div_main);
                        var div_form = $('#' + _options.plants.items.div_form);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                  
                        div.text(data.msg).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion !',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          div.dialog('close');
                                          div.remove();
                                    
                                          if(data.success){
                                          
                                                utils_library.form.validation_clear_alerts(_options.plants.items.form);
                                                utils_library.form.clear(_options.plants.items.form);
                                                div_form.dialog('close');
                                          }
                                    }
                              }]
                        });
                  },
            
                  /**
             * @name view
             * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * @param id identificador del registro del cual se traera la informacion requerida
             */
                  view: function(params){
                        
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                  
                        $.ajax({
                              url: _options.plants.url.view,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                              
                                    utils_library.form.load_data(data.data[0],  _options.plants.items.form);
                                    self.view_form_show(id, obj_plugin);
                              },
                              error: function(){
                                    $.msgbox(_options.plants.msg.view_error);  
                              }
                        });
                  },
            
                  /**
             * @name view_form_show
             * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
             *              la informacion cargada del registro a ver
             * @param id identificador del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  view_form_show: function(id, obj_plugin){
                  
                        var self = this;  
                        var buttons = [];
                        var div_form = $('#' + _options.plants.items.div_form);
                  
                        if(_options.plants.permits.edit){
                              buttons = [{
                                    text: 'Editar',
                                    click: function () {
                                    
                                          if(utils_library.form.validation_save_click(_options.plants.items.form)){
                                                self.edit_save(id, obj_plugin);
                                                div_form.dialog('close');
                                          }
                                    }
                              }];
                        }
                   
                        utils_library.form.validation_engine(_options.plants.items.form);
                  
                        div_form.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Ver',
                              width: '350px',
                              buttons: buttons,
                              close: function(){
                                    utils_library.form.validation_clear_alerts(_options.plants.items.form);
                                    utils_library.form.clear(_options.plants.items.form);
                              }
                        });
                  },
            
                  /**
             * @name edit_save
             * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
             * @param id identificar del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  edit_save: function(id, obj_plugin){
                  
                        utils_library.form.prepare_data(_options.plants.items.form, _options.plants.no_uppercase);
                  
                        var self = this;
                        var form = $('#' + _options.plants.items.form);
                        var dataForm = form.serialize();
                  
                        $.ajax({
                              url: _options.plants.url.edit,
                              type:'POST',
                              data: 'id='+id+'&'+dataForm,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.edit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.plants.msg.edit_error);  
                              }
                        });
                  },
            
                  /**
             * @name edit_success
             * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
             *              al momento de editar el registro
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta              
             */
                  edit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.plants.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }],
                                    close: function(){
                                          utils_library.form.validation_clear_alerts(_options.plants.items.form);
                                          utils_library.form.clear(_options.plants.items.form);
                                    }
                              });
                        } else {
                              $.msgbox(data.msg);  
                        }
                  },
            
                  /**
             * @name del
             * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
             * @param id identificador del registro a eliminar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  del: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var div_main = $('#' + _options.plants.items.div_main);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        div.text(_options.plants.msg.del_confirm).dialog({
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
             * @name delete_submit
             * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
             * @param id identificador del registro a eliminar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  delete_submit: function(id, obj_plugin){
                  
                        var self = this;                 

                        $.ajax({
                              url: _options.plants.url.del,
                              type:'POST',
                              data: 'id='+id,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.delete_submit_success(obj_plugin, data);
                              },
                              error: function(){
                                    $.msgbox(_options.plants.msg.del_error);  
                              }
                        });
                  },
            
                  /**
             * @name delete_submit_success
             * @description funcion que se encarga de mostrar un mensaje de success 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
                  delete_submit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.plants.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                        
                              div.text('Registro Eliminado').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }]
                              });
                        } else {
                        
                              $.msgbox(data.msg);  
                        } 
                  
                  }
            },// fin del objeto plants
            
            employees: {
                  
                  /**
             * @name add
             * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  add: function(obj_click, obj_plugin){
                  
                        var self = this;

                        utils_library.form.validation_engine(_options.employees.items.form);
                        _cbox.change(_options.employees.items.form, _base_url + 'install/configuration/fn_get_plants');
                  
                        $('#' + _options.employees.items.div_form).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: 450,
                              height: 650,
                              buttons: [{
                                    text: 'Guardar',
                                    click: function () {
                                          
                                          if(utils_library.form.validation_save_click(_options.employees.items.form)){
                                                
                                                self.add_save_submit(obj_plugin);
                                          } 
                                    }
                              },{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          utils_library.form.validation_clear_alerts(_options.employees.items.form);
                                          utils_library.form.clear(_options.employees.items.form);
                                          $('#' + _options.employees.items.div_form).dialog('close');
                                    }
                              }],
                              close: function(){
                              
                                    utils_library.form.validation_clear_alerts(_options.employees.items.form);
                                    utils_library.form.clear(_options.employees.items.form);
                              }
                        });
                 
                  
                  },
            
                  /**
                  * @name add_save_submit
                  * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  add_save_submit: function(obj_plugin){
                  
                        utils_library.form.prepare_data(_options.employees.items.form, _options.employees.no_uppercase);
                  
                        var self = this;
                        var dataForm = $('#' + _options.employees.items.form).serialize();
                  
                        $.ajax({
                              url: _options.employees.url.add,
                              type:'POST',
                              data: dataForm,
                              async: false,
                              dataType: 'json',
                              success: function(data){ 
                              
                                    self.add_save_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.employees.msg.add_error);  
                              }
                        });
                  },
            
                  /**
             * @name add_save_success
             * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
             *              al momento de ralizar el alta del nuevo registro
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
                  add_save_success: function(obj_plugin, data){
                  
                        var div_main = $('#' + _options.employees.items.div_main);
                        var div_form = $('#' + _options.employees.items.div_form);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                  
                        div.text(data.msg).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion !',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          div.dialog('close');
                                          div.remove();
                                    
                                          if(data.success){
                                          
                                                utils_library.form.validation_clear_alerts(_options.employees.items.form);
                                                utils_library.form.clear(_options.employees.items.form);
                                                div_form.dialog('close');
                                          }
                                    }
                              }]
                        });
                  },
            
                  /**
             * @name view
             * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * @param id identificador del registro del cual se traera la informacion requerida
             */
                  view: function(params){
                        
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                  
                        $.ajax({
                              url: _options.employees.url.view,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                              
                                    utils_library.form.load_data(data.data[0],  _options.employees.items.form);
                                    self.view_form_show(id, obj_plugin);
                              },
                              error: function(){
                                    $.msgbox(_options.employees.msg.view_error);  
                              }
                        });
                  },
            
                  /**
             * @name view_form_show
             * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
             *              la informacion cargada del registro a ver
             * @param id identificador del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  view_form_show: function(id, obj_plugin){
                  
                        var self = this;  
                        var buttons = [];
                        var div_form = $('#' + _options.employees.items.div_form);
                        
                        _cbox.change(_options.employees.items.form, _base_url + 'install/configuration/fn_get_plants');
                  
                        if(_options.employees.permits.edit){
                              buttons = [{
                                    text: 'Editar',
                                    click: function () {
                                    
                                          if(utils_library.form.validation_save_click(_options.employees.items.form)){
                                                self.edit_save(id, obj_plugin);
                                                div_form.dialog('close');
                                          }
                                    }
                              }];
                        }
                   
                        utils_library.form.validation_engine(_options.employees.items.form);
                  
                        div_form.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Ver',
                              width: 450,
                              height: 650,
                              buttons: buttons,
                              close: function(){
                                    utils_library.form.validation_clear_alerts(_options.employees.items.form);
                                    utils_library.form.clear(_options.employees.items.form);
                              }
                        });
                  },
            
                  /**
             * @name edit_save
             * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
             * @param id identificar del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  edit_save: function(id, obj_plugin){
                  
                        utils_library.form.prepare_data(_options.employees.items.form, _options.employees.no_uppercase);
                  
                        var self = this;
                        var form = $('#' + _options.employees.items.form);
                        var dataForm = form.serialize();
                  
                        $.ajax({
                              url: _options.employees.url.edit,
                              type:'POST',
                              data: 'id='+id+'&'+dataForm,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.edit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.employees.msg.edit_error);  
                              }
                        });
                  },
            
                  /**
             * @name edit_success
             * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
             *              al momento de editar el registro
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta              
             */
                  edit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.employees.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }],
                                    close: function(){
                                          utils_library.form.validation_clear_alerts(_options.employees.items.form);
                                          utils_library.form.clear(_options.employees.items.form);
                                    }
                              });
                        } else {
                              $.msgbox(data.msg);  
                        }
                  },
            
                  /**
             * @name del
             * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
             * @param id identificador del registro a eliminar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  del: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var div_main = $('#' + _options.employees.items.div_main);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        div.text(_options.employees.msg.del_confirm).dialog({
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
             * @name delete_submit
             * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
             * @param id identificador del registro a eliminar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  delete_submit: function(id, obj_plugin){
                  
                        var self = this;                 

                        $.ajax({
                              url: _options.employees.url.del,
                              type:'POST',
                              data: 'id='+id,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.delete_submit_success(obj_plugin, data);
                              },
                              error: function(){
                                    $.msgbox(_options.employees.msg.del_error);  
                              }
                        });
                  },
            
                  /**
             * @name delete_submit_success
             * @description funcion que se encarga de mostrar un mensaje de success 
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
                  delete_submit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                        
                              var div_main = $('#' + _options.employees.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              div.text('Registro Eliminado').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }]
                              });
                        } else {
                        
                              $.msgbox(data.msg);  
                        } 
                  
                  }
            }, // fin objeto empleados
            
            users: {
                  /**
             * @name add
             * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  add: function(obj_click, obj_plugin){
                  
                        var self = this;
                        
                        utils_library.form.validation_engine(_options.users.items.form);
                        _cbox.change(_options.users.items.form, _base_url + 'install/configuration/fn_get_plants', true, _base_url + 'install/configuration/fn_get_employees');
                  
                        $('#' + _options.users.items.div_form).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: '450px',
                              buttons: [{
                                    text: 'Guardar',
                                    click: function () {
                                          
                                          if(utils_library.form.validation_save_click(_options.users.items.form)){
                                                
                                                self.add_save_submit(obj_plugin);
                                          } 
                                    }
                              },{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          utils_library.form.validation_clear_alerts(_options.users.items.form);
                                          utils_library.form.clear(_options.users.items.form);
                                          $('#' + _options.users.items.div_form).dialog('close');
                                    }
                              }],
                              close: function(){
                              
                                    utils_library.form.validation_clear_alerts(_options.users.items.form);
                                    utils_library.form.clear(_options.users.items.form);
                              }
                        });
                 
                  
                  },
            
                  /**
                   * @name add_save_submit
                   * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
                   * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                   */
                  add_save_submit: function(obj_plugin){
                  
                        utils_library.form.prepare_data(_options.users.items.form, _options.users.no_uppercase);
                  
                        var self = this;
                        var dataForm = $('#' + _options.users.items.form).serialize();
                  
                        $.ajax({
                              url: _options.users.url.add,
                              type:'POST',
                              data: dataForm,
                              async: false,
                              dataType: 'json',
                              success: function(data){ 
                              
                                    self.add_save_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.users.msg.add_error);  
                              }
                        });
                  },
            
                  /**
             * @name add_save_success
             * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
             *              al momento de ralizar el alta del nuevo registro
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             * @param data obj json retornado por el servidor con el success y mensaje del alta 
             */
                  add_save_success: function(obj_plugin, data){
                  
                        var div_main = $('#' + _options.users.items.div_main);
                        var div_form = $('#' + _options.users.items.div_form);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                  
                        div.text(data.msg).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion !',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          div.dialog('close');
                                          div.remove();
                                    
                                          if(data.success){
                                          
                                                utils_library.form.validation_clear_alerts(_options.users.items.form);
                                                utils_library.form.clear(_options.users.items.form);
                                                div_form.dialog('close');
                                          }
                                    }
                              }]
                        });
                  },
            
                  /**
             * @name view
             * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * @param id identificador del registro del cual se traera la informacion requerida
             */
                  view: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var string = '';
                        var form = $('#' + _options.users.items.form);
                        var cbox_plants = form.find("#plant_id");
                        var cbox_employees = form.find("#employee_id");
                        
                        $.ajax({
                              url: _options.users.url.view,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                                    string = 'company_id='+data.data[0].company_id;  
                                    _cbox.load(string, cbox_plants, _base_url + 'install/configuration/fn_get_plants');
                                    
                                    string += '&plant_id='+data.data[0].plant_id;  
                                    _cbox.load(string, cbox_employees, _base_url + 'install/configuration/fn_get_employees');
                                    
                                    utils_library.form.load_data(data.data[0],  _options.users.items.form);
                                    self.view_form_show(id, obj_plugin);
                              },
                              error: function(){
                                    $.msgbox(_options.users.msg.view_error);  
                              }
                        });
                  },
            
                  /**
             * @name view_form_show
             * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
             *              la informacion cargada del registro a ver
             * @param id identificador del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  view_form_show: function(id, obj_plugin){
                  
                        var self = this;  
                        var buttons = [];
                        var div_form = $('#' + _options.users.items.div_form);
                  
                        if(_options.users.permits.edit){
                              buttons = [{
                                    text: 'Editar',
                                    click: function () {
                                    
                                          if(utils_library.form.validation_save_click(_options.users.items.form)){
                                                self.edit_save(id, obj_plugin);
                                          }
                                    }
                              }];
                        }
                   
                        _cbox.change(_options.users.items.form, _base_url + 'install/configuration/fn_get_plants');
                        utils_library.form.validation_engine(_options.users.items.form);
                  
                        div_form.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Ver',
                              width: '450px',
                              buttons: buttons,
                              close: function(){
                                    utils_library.form.validation_clear_alerts(_options.users.items.form);
                                    utils_library.form.clear(_options.users.items.form);
                              }
                        });
                  },
            
                  /**
             * @name edit_save
             * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
             * @param id identificar del registro a editar
             * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
             */
                  edit_save: function(id, obj_plugin){
                  
                        utils_library.form.prepare_data(_options.users.items.form, _options.users.no_uppercase);
                  
                        var self = this;
                        var form = $('#' + _options.users.items.form);
                        var dataForm = form.serialize();
                  
                        $.ajax({
                              url: _options.users.url.edit,
                              type:'POST',
                              data: 'id='+id+'&'+dataForm,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.edit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.users.msg.edit_error);  
                              }
                        });
                  },
            
                  /**
                  * @name edit_success
                  * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
                  *              al momento de editar el registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta              
                  */
                  edit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.users.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }],
                                    close: function(){
                                          utils_library.form.validation_clear_alerts(_options.users.items.form);
                                          utils_library.form.clear(_options.users.items.form);
                                    }
                              });
                        
                              $('#' + _options.users.items.div_form).dialog('close');
                        
                        } else {
                              $.msgbox(data.msg);  
                        }
                  },
            
                  /**
                  * @name del
                  * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
                  * @param id identificador del registro a eliminar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  del: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var div_main = $('#' + _options.users.items.div_main);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        div.text(_options.users.msg.del_confirm).dialog({
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
                  * @name delete_submit
                  * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
                  * @param id identificador del registro a eliminar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  delete_submit: function(id, obj_plugin){
                  
                        var self = this;                 

                        $.ajax({
                              url: _options.users.url.del,
                              type:'POST',
                              data: 'id='+id,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.delete_submit_success(obj_plugin, data);
                              },
                              error: function(){
                                    $.msgbox(_options.users.msg.del_error);  
                              }
                        });
                  },
            
                  /**
                  * @name delete_submit_success
                  * @description funcion que se encarga de mostrar un mensaje de success 
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta 
                  */
                  delete_submit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.users.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                        
                              div.text('Registro Eliminado').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }]
                              });
                        } else {
                        
                              $.msgbox(data.msg);  
                        } 
                  
                  }
            },// fin onjeto usuarios
            
            modules: {
                  
                  /**
                  * @name add
                  * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  add: function(obj_click, obj_plugin){
                  
                        var self = this;

                        utils_library.form.validation_engine(_options.modules.items.form);
                        
                        $("#" + _options.modules.items.form).find("#sys_name").removeAttr('disabled');
                  
                        $('#' + _options.modules.items.div_form).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: 470,
                              height: 'auto',
                              maxHeight: 0,
                              minHeight:470,
                              resizable: false,
                              create: function() {
                                    $(this).css("maxHeight", 680);    
                              },
                              buttons: [{
                                    text: 'Guardar',
                                    click: function () {
                                          
                                          if(utils_library.form.validation_save_click(_options.modules.items.form)){
                                                
                                                self.add_save_submit(obj_plugin);
                                          } 
                                    }
                              },{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          utils_library.form.validation_clear_alerts(_options.modules.items.form);
                                          utils_library.form.clear(_options.modules.items.form);
                                          $('#' + _options.modules.items.div_form).dialog('close');
                                    }
                              }],
                              close: function(){
                              
                                    utils_library.form.validation_clear_alerts(_options.modules.items.form);
                                    utils_library.form.clear(_options.modules.items.form);
                              }
                        });
                 
                  
                  },
            
                  /**
                  * @name add_save_submit
                  * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  add_save_submit: function(obj_plugin){
                  
                        utils_library.form.prepare_data(_options.modules.items.form, _options.modules.no_uppercase);
                  
                        var self = this;
                        var dataForm = $('#' + _options.modules.items.form).serialize();
                  
                        $.ajax({
                              url: _options.modules.url.add,
                              type:'POST',
                              data: dataForm,
                              async: false,
                              dataType: 'json',
                              success: function(data){ 
                              
                                    self.add_save_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.modules.msg.add_error);  
                              }
                        });
                  },
            
                  /**
                  * @name add_save_success
                  * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
                  *              al momento de ralizar el alta del nuevo registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta 
                  */
                  add_save_success: function(obj_plugin, data){
                  
                        var div_main = $('#' + _options.modules.items.div_main);
                        var div_form = $('#' + _options.modules.items.div_form);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                  
                        div.text(data.msg).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion !',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          div.dialog('close');
                                          div.remove();
                                    
                                          if(data.success){
                                          
                                                utils_library.form.validation_clear_alerts(_options.modules.items.form);
                                                utils_library.form.clear(_options.modules.items.form);
                                                div_form.dialog('close');
                                          }
                                    }
                              }]
                        });
                  },
            
                  /**
             * @name view
             * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
             * @param id identificador del registro del cual se traera la informacion requerida
             */
                  view: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        
                        $.ajax({
                              url: _options.modules.url.view,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                              
                                    utils_library.form.load_data(data.data[0],  _options.modules.items.form);
                                    self.view_form_show(id, obj_plugin);
                              },
                              error: function(){
                                    $.msgbox(_options.modules.msg.view_error);  
                              }
                        });
                  },
            
                  /**
                  * @name view_form_show
                  * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
                  *              la informacion cargada del registro a ver
                  * @param id identificador del registro a editar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  view_form_show: function(id, obj_plugin){
                  
                        var self = this;  
                        var buttons = [];
                        var div_form = $('#' + _options.modules.items.div_form);
                        var form = $('#' + _options.modules.items.form);
                  
                        form.find('#sys_name').attr('disabled', 'disabled');
                  
                        if(_options.modules.permits.edit){
                              buttons = [{
                                    text: 'Editar',
                                    click: function () {
                                    
                                          if(utils_library.form.validation_save_click(_options.modules.items.form)){
                                                self.edit_save(id, obj_plugin);
                                                div_form.dialog('close');
                                          }
                                    }
                              }];
                        }
                   
                        utils_library.form.validation_engine(_options.modules.items.form);
                  
                        div_form.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Ver',
                              width: 350,
                              height: 575,
                              buttons: buttons,
                              close: function(){
                                    utils_library.form.validation_clear_alerts(_options.modules.items.form);
                                    utils_library.form.clear(_options.modules.items.form);
                              }
                        });
                  },
            
                  /**
                  * @name edit_save
                  * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
                  * @param id identificar del registro a editar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  edit_save: function(id, obj_plugin){
                  
                        utils_library.form.prepare_data(_options.modules.items.form, _options.modules.no_uppercase);
                  
                        var self = this;
                        var form = $('#' + _options.modules.items.form);
                        var dataForm = form.serialize();
                  
                        $.ajax({
                              url: _options.modules.url.edit,
                              type:'POST',
                              data: 'id='+id+'&'+dataForm,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.edit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.modules.msg.edit_error);  
                              }
                        });
                  },
            
                  /**
                  * @name edit_success
                  * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
                  *              al momento de editar el registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta              
                  */
                  edit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.modules.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }],
                                    close: function(){
                                          utils_library.form.validation_clear_alerts(_options.modules.items.form);
                                          utils_library.form.clear(_options.modules.items.form);
                                    }
                              });
                        } else {
                              $.msgbox(data.msg);  
                        }
                  },
            
                  /**
                  * @name del
                  * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
                  * @param id identificador del registro a eliminar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  del: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var div_main = $('#' + _options.modules.items.div_main);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        div.text(_options.modules.msg.del_confirm).dialog({
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
                  * @name delete_submit
                  * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
                  * @param id identificador del registro a eliminar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  delete_submit: function(id, obj_plugin){
                  
                        var self = this;                 

                        $.ajax({
                              url: _options.modules.url.del,
                              type:'POST',
                              data: 'id='+id,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.delete_submit_success(obj_plugin, data);
                              },
                              error: function(){
                                    $.msgbox(_options.modules.msg.del_error);  
                              }
                        });
                  },
            
                  /**
                  * @name delete_submit_success
                  * @description funcion que se encarga de mostrar un mensaje de success 
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta 
                  */
                  delete_submit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.modules.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                        
                              div.text('Registro Eliminado').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }]
                              });
                        } else {
                        
                              $.msgbox(data.msg);  
                        } 
                  
                  },
                  
                  definir: {
            
                        /**
                        * @name add
                        * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
                        * @param id identificador del modulo al caul se le agregaran las acciones que tendra 
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        */
                        add: function(params){
                  
                              var self = this;
                              var id = params.id;
                              var obj_plugin = params.obj_plugin;

                              utils_library.form.validation_engine(_options.modules.items.form_actions);
                              _cbox.change("catalogo-form-actions", _base_url + 'install/configuration/fn_get_plants');
                  
                              $("#" + _options.modules.items.form_actions).find("#sys_name").removeAttr('disabled');
                  
                              $('#' + _options.modules.items.div_form_actions).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Nueva Accion',
                                    width: '350px',
                                    buttons: [{
                                          text: 'Guardar',
                                          click: function () {
                                          
                                                if(utils_library.form.validation_save_click(_options.modules.items.form_actions)){
                                                
                                                      self.add_save_submit(id, obj_plugin);
                                                } 
                                          }
                                    },{
                                          text: 'Cerrar',
                                          click: function () {
                                    
                                                utils_library.form.validation_clear_alerts(_options.modules.items.form_actions);
                                                utils_library.form.clear(_options.modules.items.form_actions);
                                                $('#' + _options.modules.items.div_form_actions).dialog('close');
                                          }
                                    }],
                                    close: function(){
                              
                                          utils_library.form.validation_clear_alerts(_options.modules.items.form_actions);
                                          utils_library.form.clear(_options.modules.items.form_actions);
                                    }
                              });
                 
                  
                        },
            
                        /**
                        * @name add_save_submit
                        * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
                        * @param id identificador del modulo al caul se le agregaran las acciones que tendra 
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        */
                        add_save_submit: function(id, obj_plugin){
                  
                              utils_library.form.prepare_data(_options.modules.items.form, _options.modules.no_uppercase);
                  
                              var self = this;
                              var dataForm = $('#' + _options.modules.items.form_actions).serialize();
                  
                              $.ajax({
                                    url: _options.modules.url.definir_add,
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
                        * @name add_save_success
                        * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
                        *              al momento de ralizar el alta del nuevo registro
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        * @param data obj json retornado por el servidor con el success y mensaje del alta 
                        */
                        add_save_success: function(obj_plugin, data){
                  
                              var div_main = $('#' + _options.modules.items.div_main);
                              var div_form = $('#' + _options.modules.items.div_form_actions);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                    
                                                div.dialog('close');
                                                div.remove();
                                    
                                                if(data.success){
                                          
                                                      utils_library.form.validation_clear_alerts(_options.modules.items.form_actions);
                                                      utils_library.form.clear(_options.modules.items.form_actions);
                                                      div_form.dialog('close');
                                                }
                                          }
                                    }]
                              });
                        }
            
                  }, // fin funciones definir
                  
                  actions: {
                  
                        module_name: '',
                        div_content:{},
                  
                        load: function(params){

                              var self = this;
                              var id = params.id;
                              
                              $.ajax({
                                    url: _options.modules.url.actions_load,
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
                        * @name html_success
                        * @description Funcion que se encarga de construir el html para crear la lista ul que contendra a los empleados de la planta
                        *              y de seleccionar en el check del form los empleados a los cuales seles asignara un rol en particular
                        * @param request objeto json con los datos arrojados en el query
                        */
                        html_success: function(module_id, request){
                        
                              var self = this;
                              var div_main = $('#' + _options.modules.items.div_main);
                        
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
                  
                        html_ul: function(li, addclass){
                        
                              return $('<ul></ul>').addClass(addclass).appendTo(li); 
                        },
                  
                        html_li: function(ul){
                        
                              return $('<li></li>').appendTo(ul);
                        },
                  
                        html_label: function(span, name, sys_name){
                        
                              return $('<label></label>').text(name + ' - ' + '( '+ sys_name +' )').css('width', '80%').css('cursor', 'pointer').appendTo(span);
                        },
                  
                        html_span: function(li, name){
                        
                              return $("<span></span>").addClass('ui-state-default').css('margin-top', '10px').css('padding-left', '10px').css('padding-top', '10px').css('padding-bottom', '10px').css('display', 'block').appendTo(li);
                        },
                  
                        html_a_eliminar: function(id, addclass,span){
                        
                              return $('<a></a>').text('Eliminar').addClass(addclass)
                              .css('float', 'right').css('color', '#fff')
                              .css('margin-top', '-20px').css('margin-right', '5px')
                              .appendTo(span).click(function(){
                              
                                    var a = $(this);
                              
                                    $.ajax({
                                          url: _options.modules.url.actions_del,
                                          type:'POST',
                                          data:'id='+id,
                                          dataType:'json',
                                          async: false,
                                          success: function(data){ 
                                          
                                                if(data.success){
                                                
                                                      var li = a.parent().parent();
                                                      li.remove();
                                                
                                                } else {
                                                
                                                      var div_main = $('#' + _options.modules.items.div_main);
                                                      var div = $('<div></div>').appendTo(div_main);
                                                
                                                      div.text(data.msg).dialog({
                                                            autoOpen: true,
                                                            modal: true,
                                                            title: 'Acciones',
                                                            width: 700,
                                                            height: 'auto',
                                                            maxHeight: 0,
                                                            resizable: false,
                                                            position: 'top',
                                                            buttons: [{
                                                                  text: 'Cancelar',
                                                                  click: function () {
                                                                        div.dialog('close');
                                                                        div.remove();
                                                                  }
                                                            }]
                                                      });
                                                }
                                          },
                                          error: function(){
                                          
                                                $.msgbox("Se sucito un problema al tratar de recuperar las acciones para este modulo.");  
                                          }
                                    }); 
                              });
                        },
                  
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
                        * @name view_load_data
                        * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
                        * @param id identificador del registro del cual se traera la informacion requerida
                        */
                        view_load_data: function(id){
                              
                              var string = '';
                              var cbox_plants = $("#" + _options.modules.items.form_actions).find("#plant_id");
                        
                              $.ajax({
                                    url: _options.modules.url.actions_load,
                                    type:'POST',
                                    data:'id='+id,
                                    dataType:'json',
                                    async: false,
                                    success: function(data){ 
                                          
                                          string = 'company_id='+data.data[0].company_id; 
                                          _cbox.load(string, cbox_plants, _base_url + 'install/configuration/fn_get_plants');
                                          utils_library.form.load_data(data.data[0],  _options.modules.items.form_actions);
                                    },
                                    error: function(){
                                    
                                          $.msgbox("Se sucito un problema al tratar de recuperar las acciones para este modulo.");  
                                    }
                              });
                        },
                  
                        /**
                        * @name view_form_show
                        * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
                        *              la informacion cargada del registro a ver
                        * @param id identificador del registro a editar
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        */
                        view_form_show: function(module_id, id, obj_plugin){
                        
                              var self = this;  
                              var div_form = $('#' + _options.modules.items.div_form_actions);
                        
                              utils_library.form.validation_engine(_options.modules.items.form_actions);
                              _cbox.change("catalogo-form-actions", _base_url + 'install/configuration/fn_get_plants');
                        
                              $("#" + _options.modules.items.form_actions).find("#sys_name").attr('disabled', 'disabled');
                        
                              div_form.dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: self.module_name,
                                    width: '350px',
                                    buttons: [{
                                          text: 'Editar',
                                          click: function () {
                                                
                                                if(utils_library.form.validation_save_click(_options.modules.items.form_actions)){
                                                      
                                                      self.edit_save(module_id, id, obj_plugin);
                                                      div_form.dialog('close');
                                                }
                                          }
                                    }],
                                    close: function(){
                                    
                                          utils_library.form.validation_clear_alerts(_options.modules.items.form_actions);
                                          utils_library.form.clear(_options.modules.items.form_actions);
                                    }
                              });
                        },
                  
                        /**
                        * @name edit_save
                        * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
                        * @param id identificar del registro a editar
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        */
                        edit_save: function(module_id, id, obj_plugin){
                        
                              utils_library.form.prepare_data(_options.modules.items.form, _options.modules.no_uppercase);
                        
                              var self = this;
                              var form = $('#' + _options.modules.items.form_actions);
                              var dataForm = form.serialize();
                        
                              $.ajax({
                                    url: _options.modules.url.actions_edit,
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
                        * @name edit_success
                        * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
                        *              al momento de editar el registro
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        * @param data obj json retornado por el servidor con el success y mensaje del alta              
                        */
                        edit_success: function(module_id, data){
                        
                              if(data.success){
                              
                                    this.div_content.remove();
                                    this.load({
                                          id:module_id
                                    });
                              
                                    var div_main = $('#' + _options.modules.items.div_main);
                                    var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                              
                                    div.text(data.msg).dialog({
                                          autoOpen: true,
                                          modal: true,
                                          title: 'Atencion !',
                                          buttons: [{
                                                text: 'Cerrar',
                                                click: function () {
                                                      div.dialog('close');
                                                      div.remove();
                                                }
                                          }],
                                          close: function(){
                                          
                                                utils_library.form.validation_clear_alerts(_options.modules.items.form_actions);
                                                utils_library.form.clear(_options.modules.items.form_actions);
                                          }
                                    });
                              } else {
                                    $.msgbox(data.msg);  
                              }
                        },
                  
                        /**
                        * @name del
                        * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
                        * @param id identificador del registro a eliminar
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        */
                        del: function(id, obj_plugin){
                        
                              var self = this;
                              var div_main = $('#' + _options.modules.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              div.text(_options.modules.msg.del_confirm).dialog({
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
                        * @name delete_submit
                        * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
                        * @param id identificador del registro a eliminar
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        */
                        delete_submit: function(id, obj_plugin){
                        
                              var self = this;                 
                        
                              $.ajax({
                                    url: _options.modules.url.actions_del,
                                    type:'POST',
                                    data: 'id='+id,
                                    async: false,
                                    dataType:'json',
                                    success: function(data){ 
                                    
                                          self.delete_submit_success(obj_plugin, data);
                                    },
                                    error: function(){
                                          $.msgbox(_options.modules.msg.del_error);  
                                    }
                              });
                        },
                  
                        /**
                        * @name delete_submit_success
                        * @description funcion que se encarga de mostrar un mensaje de success 
                        * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                        * @param data obj json retornado por el servidor con el success y mensaje del alta 
                        */
                        delete_submit_success: function(obj_plugin, data){
                        
                              if(data.success){
                              
                                    var div_main = $('#' + _options.modules.items.div_main);
                                    var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                              
                                    obj_plugin._$mainContainer.empty();
                                    obj_plugin._create();
                              
                                    div.text('Registro Eliminado').dialog({
                                          autoOpen: true,
                                          modal: true,
                                          title: 'Atencion',
                                          buttons: [{
                                                text: 'Cerrar',
                                                click: function () {
                                                      div.dialog('close');
                                                      div.remove();
                                                }
                                          }]
                                    });
                              } else {
                              
                                    $.msgbox(data.msg);  
                              } 
                        
                        }
                  }// fin funciones actions
                  
            },// fin objeto modules
            
            roles:{
                  
                  /**
                  * @name add
                  * @description funcion que se encarga de mostrar el formulario de nuevo en el grid con el plugin de dailog modal
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  add: function(obj_click, obj_plugin){
                  
                        var self = this;

                        utils_library.form.validation_engine(_options.roles.items.form);
                        _cbox.change(_options.roles.items.form, _base_url + 'install/configuration/fn_get_plants');
                  
                        $('#' + _options.roles.items.div_form).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: '350px',
                              buttons: [{
                                    text: 'Guardar',
                                    click: function () {
                                          
                                          if(utils_library.form.validation_save_click(_options.roles.items.form)){
                                                
                                                self.add_save_submit(obj_plugin);
                                          } 
                                    }
                              },{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          utils_library.form.validation_clear_alerts(_options.roles.items.form);
                                          utils_library.form.clear(_options.roles.items.form);
                                          $('#' + _options.roles.items.div_form).dialog('close');
                                    }
                              }],
                              close: function(){
                              
                                    utils_library.form.validation_clear_alerts(_options.roles.items.form);
                                    utils_library.form.clear(_options.roles.items.form);
                              }
                        });
                 
                  
                  },
            
                  /**
                  * @name add_save_submit
                  * @description funcion que se encarga de realizar la peticion ajax al servidor para agregar un nuevo registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  add_save_submit: function(obj_plugin){
                  
                        utils_library.form.prepare_data(_options.roles.items.form, _options.roles.no_uppercase);
                  
                        var self = this;
                        var dataForm = $('#' + _options.roles.items.form).serialize();
                  
                        $.ajax({
                              url: _options.roles.url.add,
                              type:'POST',
                              data: dataForm,
                              async: false,
                              dataType: 'json',
                              success: function(data){ 
                              
                                    self.add_save_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.roles.msg.add_error);  
                              }
                        });
                  },
            
                  /**
                  * @name add_save_success
                  * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido agregado o si hubo un problema 
                  *              al momento de ralizar el alta del nuevo registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta 
                  */
                  add_save_success: function(obj_plugin, data){
                  
                        var div_main = $('#' + _options.roles.items.div_main);
                        var div_form = $('#' + _options.roles.items.div_form);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        obj_plugin._$mainContainer.empty();
                        obj_plugin._create();
                  
                        div.text(data.msg).dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion !',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                    
                                          div.dialog('close');
                                          div.remove();
                                    
                                          if(data.success){
                                          
                                                utils_library.form.validation_clear_alerts(_options.roles.items.form);
                                                utils_library.form.clear(_options.roles.items.form);
                                                div_form.dialog('close');
                                          }
                                    }
                              }]
                        });
                  },
            
                  /**
                  * @name view
                  * @description funcion que se encarga de traer los datos al servidor para mostrar la informacion en el formulario
                  * @param id identificador del registro del cual se traera la informacion requerida
                  */
                  view: function(params){
                        
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var string = '';
                        var cbox_plants = $('#' + _options.roles.items.form).find("#plant_id");
                        
                        cbox_plants.empty();
                  
                        $.ajax({
                              url: _options.roles.url.view,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                                    _cbox.load(string, cbox_plants, _base_url + 'install/configuration/fn_get_plants');
                                    utils_library.form.load_data(data.data[0],  _options.roles.items.form);
                                    self.view_form_show(id, obj_plugin);
                              },
                              error: function(){
                                    $.msgbox(_options.roles.msg.view_error);  
                              }
                        });
                  },
            
                  /**
                  * @name view_form_show
                  * @description funcion que se encarga de mostrar el formulario con el plugin de dialog modal de jquery ui con
                  *              la informacion cargada del registro a ver
                  * @param id identificador del registro a editar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  view_form_show: function(id, obj_plugin){
                  
                        var self = this;  
                        var buttons = [];
                        var div_form = $('#' + _options.roles.items.div_form);
                  
                        if(_options.roles.permits.edit){
                              buttons = [{
                                    text: 'Editar',
                                    click: function () {
                                    
                                          if(utils_library.form.validation_save_click(_options.roles.items.form)){
                                                self.edit_save(id, obj_plugin);
                                                div_form.dialog('close');
                                          }
                                    }
                              }];
                        }
                   
                        utils_library.form.validation_engine(_options.roles.items.form);
                        _cbox.change(_options.roles.items.form, _base_url + 'install/configuration/fn_get_plants');
                  
                        div_form.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Ver',
                              width: '350px',
                              buttons: buttons,
                              close: function(){
                                    utils_library.form.validation_clear_alerts(_options.roles.items.form);
                                    utils_library.form.clear(_options.roles.items.form);
                              }
                        });
                  },
            
                  /**
                  * @name edit_save
                  * @description function que se encarga de realizar la peticion ajax al servidor para editar la infomacion en la base de datos
                  * @param id identificar del registro a editar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  edit_save: function(id, obj_plugin){
                  
                        utils_library.form.prepare_data(_options.roles.items.form, _options.roles.no_uppercase);
                  
                        var self = this;
                        var form = $('#' + _options.roles.items.form);
                        var dataForm = form.serialize();
                  
                        $.ajax({
                              url: _options.roles.url.edit,
                              type:'POST',
                              data: 'id='+id+'&'+dataForm,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.edit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.roles.msg.edit_error);  
                              }
                        });
                  },
            
                  /**
                  * @name edit_success
                  * @description funcion que se encarga de mostrar un mensaje de que el registro ha sido editado o que hubo un error 
                  *              al momento de editar el registro
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta              
                  */
                  edit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.roles.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                  
                              div.text(data.msg).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion !',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }],
                                    close: function(){
                                    
                                          utils_library.form.validation_clear_alerts(_options.roles.items.form);
                                          utils_library.form.clear(_options.roles.items.form);
                                    }
                              });
                        } else {
                              $.msgbox(data.msg);  
                        }
                  },
            
                  /**
                  * @name del
                  * @description funcion que se encarga de mandar un mensaje de confirmacion si realmente el usuario quiere eliminar el registro
                  * @param id identificador del registro a eliminar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  del: function(params){
                  
                        var self = this;
                        var id = params.id;
                        var obj_plugin = params.obj_plugin;
                        var div_main = $('#' + _options.roles.items.div_main);
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                  
                        div.text(_options.roles.msg.del_confirm).dialog({
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
                  * @name delete_submit
                  * @description funcion que se encarga de realizar la peticion ajax al servidor para eliminar el registro seleccionado
                  * @param id identificador del registro a eliminar
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  */
                  delete_submit: function(id, obj_plugin){
                  
                        var self = this;                 

                        $.ajax({
                              url: _options.roles.url.del,
                              type:'POST',
                              data: 'id='+id,
                              async: false,
                              dataType:'json',
                              success: function(data){ 
                              
                                    self.delete_submit_success(obj_plugin, data);
                              },
                              error: function(){
                              
                                    $.msgbox(_options.roles.msg.del_error);  
                              }
                        });
                  },
            
                  /**
                  * @name delete_submit_success
                  * @description funcion que se encarga de mostrar un mensaje de success 
                  * @param obj_plugin objeto que es pasado del plugin catalogTable para volver a cargar la tabla
                  * @param data obj json retornado por el servidor con el success y mensaje del alta 
                  */
                  delete_submit_success: function(obj_plugin, data){
                  
                        if(data.success){
                        
                              var div_main = $('#' + _options.roles.items.div_main);
                              var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(div_main);
                        
                              obj_plugin._$mainContainer.empty();
                              obj_plugin._create();
                        
                              div.text('Registro Eliminado').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Atencion',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
                                          }
                                    }]
                              });
                        } else {
                        
                              $.msgbox(data.msg);  
                        } 
                  
                  },
                  
                  definir: {            
            
                        /**
                        * @name load_modules
                        * @description Funcion que se encarga de realizar la peticion ajax al servidor para cargar los datos de los modulos
                        *              dados de alta en el sistema y cuales estan ya asignado a un rol
                        * @param role_id integer identificador del rol al cual se recuperara que modulos estan asignados a el
                        * @param role_name string nombre del rol
                        */
                        load_modules: function(params){
                  
                              var self = this;
                              var role_id = params.id;
                              var role_name = params.obj_click.parent().parent().find('td').eq(0).text();
                        
                              $.ajax({
                                    url: _options.roles.url.definir_get_modules,
                                    type:'POST',
                                    async:false,
                                    data: 'role_id='+role_id,
                                    success: function(data){
                                          self.html_success(role_id, role_name, data);
                                    },
                                    error: function(){
                                          $.msgbox(_options.roles.msg.definir_error);
                                    }
                              });
                        },
            
                        /**
                        * @name html_success
                        * @description Funcion que se encarga de construir el html para crear la lista ul que contendra los modulos del sistema
                        *              y de seleccionar en el check del form que modulos estan asignados a este rol
                        * @param role_id identificador del rol al cual sele asignaran los modulos que se seleccionen
                        * @param role_name string nombre del rol
                        * @param data datos de los modulos con los que cuenta el sistema actualmente
                        */
                        html_success: function(role_id, role_name, data){
                  
                              var self = this;
                              var request = $.parseJSON(data);
                              var div_main = $('#' + _options.roles.items.div_main);
                  
                              // validamos si el query se realizo con exito
                              if(request.success){
                    
                                    var div = $('<div></div>').appendTo(div_main);
                                    var form = $('<form></form>').attr({
                                          id:'form-module'
                                    }).appendTo(div);
                                    
                                    // se agrego para lode empresa planta
                                    var company_id = request.company_id;
                                    var plant_id = request.plant_id;
                                    
                                    $("<input />").attr({
                                          type:'hidden', 
                                          id:'company_id', 
                                          name:'company_id', 
                                          value:company_id
                                    }).appendTo(form);
                                    $("<input />").attr({
                                          type:'hidden', 
                                          id:'plant_id', 
                                          name:'plant_id', 
                                          value:plant_id
                                    }).appendTo(form);                                    
                                    
                                    //continuea con el proceso normal de roles
                                    var ul_father = $('<ul></ul>').attr({
                                          id: 'sortable'
                                    }).appendTo(form);
                        
                                    $.each(request.data, function(key, value){
                        
                                          li_father = self.html_li(ul_father);
                                          span_father = self.html_span(li_father);
                                          label_father = self.html_label(span_father, value.module_name);
                                   
                                          self.html_icon(span_father, (value.is_father == 't' ? true : false), 'ul-children');
                              
                                          check_father = self.html_check(label_father, value.id, value.module_id);
                                          check_father.change(function(){
                                                //                                                                  
                                                //                                    if($(this).is(':checked')){
                                                //
                                                //                                          $(this).parent('li').find('ul').find('li').find('.check_children').attr('checked', true);
                                                //                                    } else {
                                                //
                                                //                                          $(this).parent('li').find('ul').find('li').find('.check_children').attr('checked', false);
                                                //                                    }
                                                });
                              
                                          if(value.module_id != null){
                                                check_father.attr('checked', true);
                                          }
                              
                                          if(typeof(value.children) != "undefined" && value.children != null){
                              
                                                ul_children = self.html_ul(li_father, 'ul-children');
                                                ul_children.css('display', 'none');  
                                    
                                                $.each(value.children, function(index, children){

                                                      li_children = self.html_li(ul_children);
                                                      span_children = self.html_span(li_children);
                                                      label_children = self.html_label(span_children, children.module_name);
                                    
                                                      check_children = self.html_check(label_children, children.id, children.module_id);
                                                      check_children.click(function(){

                                                            check_father.attr('checked', true);
                                                      });
                                    
                                                      if(children.module_id != null){
                                                            check_children.attr('checked', true);
                                                      }
                                                });
                                          }
                                    });
                        
                                    div.dialog({
                                          autoOpen: true,
                                          modal: true,
                                          title: role_name,
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
                                          },{
                                                text: 'Definir',
                                                click: function () {
                                                      self.add_modules(role_id, form);
                                                      div.dialog('close');
                                                      div.remove();
                                                }
                                          }]
                                    });
                              } else {
                                    $.msgbox(request.msg);        
                              }
                        },
            
                        html_ul: function(li){
                  
                              return $('<ul></ul>').addClass('ul_children').appendTo(li); 
                        },
            
                        html_li: function(ul){
                  
                              return $('<li></li>').appendTo(ul);
                        },
            
                        html_label: function(span, name){
                  
                              return $('<label></label>').text(name).css('width', '80%').css('cursor', 'pointer').appendTo(span);
                        },
            
                        html_span: function(li, name){
                  
                              return $("<span></span>").addClass('ui-state-default').css('margin-top', '10px').css('padding-left', '10px').css('padding-top', '10px').css('padding-bottom', '10px').css('display', 'block').appendTo(li);
                        },
            
                        html_icon: function(label, is_father){
                  
                              var span = $("<span></span>").css('width', '10%').css('float', 'right').css('margin-top', '-15px').css('display', 'block').css('cursor', 'pointer').appendTo(label);
                  
                              if(is_father){
                        
                                    span.addClass('icon-arrow-up');
                              }
                  
                              span.click(function(){
                        
                                    var obj = $(this)
                                    var style = obj.attr('class');
                        
                                    if(style == 'icon-arrow-down'){
                              
                                          obj.removeClass('icon-arrow-down');
                                          obj.addClass('icon-arrow-up');
                              
                                          li = obj.parent().parent();
                                          li.find('.ul_children').slideUp();
                                    } else {
                              
                                          obj.removeClass('icon-arrow-up');
                                          obj.addClass('icon-arrow-down');
                              
                                          li = obj.parent().parent(); 
                                          li.find('.ul_children').show('slow');
                                    }
                              });
                        },
            
                        html_check: function(label, id, module_id){
                  
                              return $('<input type="checkbox" id="checkbox" name="modules[]" /> ')
                              .css({
                                    'margin-right':'5px'
                              })
                              .val(id)
                              .prependTo(label);
                        },
            
                        /**
                        * @name add_modules
                        * @description funcion que se encarga de realizar la peticion ajax para guardar la definicion de que modulos
                        *              que van a pertencer al rol seleccionado
                        * @param role_id identificador del rol en el cual se definiran los modulos
                        * @param form objeto del formulario que se creo para seleccionar los checbox de los modulos
                        */
                        add_modules: function(role_id, form){
                  
                              var data = form.serialize();
                  
                              $.ajax({
                                    url: _options.roles.url.definir_add_modules,
                                    type:'POST',
                                    async:false,
                                    data: 'role_id='+ role_id +'&'+data,
                                    dataType:'json',
                                    success: function(data){
                              
                                          $.msgbox(data.msg);
                                    },
                                    error: function(){
                                          $.msgbox("Problemas de conexion con el Servidor al definir los modulos del rol.");
                                    }
                              });
                        }
                  }, // termina funciones definir
            
                  asignar: {
                  
                        /**
                        * @name load_employees
                        * @description funcion que se encarga de realizar la peticion ajax al servidor para traer a los empleados de la planta
                        *              para asignarles un rol en particular
                        * @param role_id identificador del rol
                        * @param role_name nombre del rol
                        */
                        load_employees: function(params){
                        
                              var self = this;
                              var role_id = params.id;
                              var role_name = params.obj_click.parent().parent().find('td').eq(0).text();
                        
                              $.ajax({
                                    url: _options.roles.url.asignar_get_employees,
                                    type:'POST',
                                    async:false,
                                    data:'role_id='+role_id,
                                    success: function(data){
                                    
                                          self.html_success(role_id, role_name, data);
                                    },
                                    error: function(){
                                    
                                          $.msgbox("Problemas de conexion con el Servidor al cargar los empleados.");
                                    }
                              });
                        },
                  
                        /**
                        * @name html_success
                        * @description Funcion que se encarga de construir el html para crear la lista ul que contendra a los empleados de la planta
                        *              y de seleccionar en el check del form los empleados a los cuales seles asignara un rol en particular
                        * @param role_id identificador del rol
                        * @param data objeto json con los datos arrojados en el query
                        * @param role_name nombre del rol
                        */
                        html_success: function(role_id, role_name, data){
                        
                              var self = this;
                              var request = $.parseJSON(data);
                              var div_main = $('#' + _options.roles.items.div_main);
                        
                              // validamos si el query se realizo con exito
                              if(request.success){
                              
                                    var div = $('<div></div>').appendTo(div_main);
                                    var form = $('<form></form>').attr({
                                          id:'form-employee'
                                    }).appendTo(div);
                                    
                                    // se agrego para lode empresa planta
                                    var company_id = request.company_id;
                                    var plant_id = request.plant_id;
                                    
                                    $("<input />").attr({
                                          type:'hidden', 
                                          id:'company_id', 
                                          name:'company_id', 
                                          value:company_id
                                    }).appendTo(form);
                                    $("<input />").attr({
                                          type:'hidden', 
                                          id:'plant_id', 
                                          name:'plant_id', 
                                          value:plant_id
                                    }).appendTo(form);                                    
                                    
                                    var ul = $('<ul></ul>').appendTo(form);
                              
                                    // recorremos los datos arrojados por el query
                                    $.each(request.data, function(index, value){
                                    
                                          li = self.html_li(ul);
                                          span = self.html_span(li);
                                          label = self.html_label(span, value.name + ' ' + value.lastname_father + ' ' + value.lastname_mother, value.name);
                                    
                                          check_employee = $('<input type="checkbox" name="employees[]" value="" /> ').css({
                                                'margin-right':'5px'
                                          }).val(value.id).prependTo(label);
                                    
                                          // validamos si el empleado esta actualmente asignado al rol si es asi marcamos como seleccionado el check
                                          // y agregamos un link para sele puedan asignar excepciones al empleado para este rol si asi se requiere
                                          if(value.employee_id != null){
                                          
                                                check_employee.attr('checked', true);
                                          
                                                a = $('<a></a>').text('Excepciones').addClass('btn btn-warning').css('color', '#fff').css('float', 'right').css('margin-top', '-25px').css('margin-right', '10px').appendTo(span).click(function(){
                                                
                                                      var employee_name = $(this).parent().find('label').text();
                                                      self.exceptions.for_employee(role_id, value.id, employee_name, company_id, plant_id);
                                                });
                                          }
                                    
                                    
                                    });
                              
                                    div.dialog({
                                          autoOpen: true,
                                          modal: true,
                                          title: role_name,
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
                                          },{
                                                text: 'Definir',
                                                click: function () {
                                                      self.add_employees(role_id, form);
                                                      div.dialog('close');
                                                      div.remove();
                                                }
                                          }]
                                    });
                              } else {
                                    $.msgbox(request.msg);        
                              }
                        },
                  
                        html_li: function(ul){
                        
                              return $('<li></li>').appendTo(ul);
                        },
                  
                        html_span: function(li, name){
                        
                              return $("<span></span>").addClass('ui-state-default').css('margin-top', '10px').css('padding-left', '10px').css('padding-top', '10px').css('padding-bottom', '10px').css('display', 'block').appendTo(li);
                        },
                  
                        html_label: function(span, name){
                        
                              return $('<label></label>').text(name).css('width', '80%').css('cursor', 'pointer').appendTo(span);
                        },
                  
                  
                        /**
                        * @name add_employees
                        * @description Funcion que se encarga de realizar la peticion ajax para asignar que empleados con taran con el rol
                        *              seleccionado
                        * @param role_id identificador del rol 
                        * @param form objeto del formulario que se creo para seleccionar los checbox de los empleados
                        */
                        add_employees: function(role_id, form){
                              var data = form.serialize();
                        
                              $.ajax({
                                    url: _options.roles.url.asignar_add_employees,
                                    type:'POST',
                                    async:false,
                                    data: 'role_id='+ role_id +'&'+data,
                                    dataType:'json',
                                    success: function(data){
                                    
                                          $.msgbox(data.msg);
                                    },
                                    error: function(){
                                          $.msgbox("Problemas de conexion con el Servidor al definir los modulos del rol.");
                                    }
                              });
                        }, 
                        
                        exceptions: {
                  
                              /**
                        *  @name for_employee
                        *  @description funcion que se encarga de recuperar los modulos del sistema y las exepciones con las que cuenta un empleado
                        *               en caso de que tenga excepciones registradas para el modulo
                        */
                              for_employee: function(role_id, employee_id, employee_name, company_id, plant_id){
                        
                                    var self = this;
                                    
                                    $.ajax({
                                          url: _options.roles.url.exeptions_get,
                                          type:'POST',
                                          async:false,
                                          data: 'role_id='+ role_id +'&employee_id=' + employee_id +'&company_id=' + company_id +'&plant_id=' + plant_id,
                                          dataType:'json',
                                          success: function(data){
                                    
                                                self.html_success(role_id, employee_id, employee_name, data, company_id, plant_id);
                                          },
                                          error: function(){
                                                $.msgbox("Problemas de conexion con el Servidor al definir los modulos del rol.");
                                          }
                                    });
                        
                        
                              },
                  
                              /**
                              * @name html_success
                              * @description funcion que se encarga de crear el html de la lista de modulos y exepciones usa las clases de 
                              *              boostrap para poder dar el diseño y comportamiento de los tabs
                              * @param role_id identificador del rol al cual pertenece el empleado y los modulos del rol
                              * @param employee_id integer dentificador del empleado al cual sele asignaran las excepciones en un modulo en particular
                              * @param employee_name string nombre del empleado
                              * @param data resultado de los datos arrojados por el query
                              */
                              html_success: function(role_id, employee_id, employee_name, data, company_id, plant_id){
                        
                                    var self = this;
                                    var div = $('#' + _options.roles.items.div_main);
                                    var div_main = $('<div></div>').appendTo(div); 
                                    var form = $('<form></form>').appendTo(div_main);
                                    
                                     // se agrego para lode empresa planta
                                    $("<input />").attr({
                                          type:'hidden', 
                                          id:'company_id', 
                                          name:'company_id', 
                                          value:company_id
                                    }).appendTo(form);
                                    $("<input />").attr({
                                          type:'hidden', 
                                          id:'plant_id', 
                                          name:'plant_id', 
                                          value:plant_id
                                    }).appendTo(form);                    
                                    
                                    var ul_father = $('<ul></ul>').appendTo(form);
                        
                                    // recorremos los datos 
                                    $.each(data.data, function(key, value){
                              
                                          li_father = self.html_li(ul_father);
                                          span_father = self.html_span(li_father);
                                          label_father = self.html_label(span_father, value.module_name);
                              
                                          self.html_icon(span_father, (value.is_father == 't' ? true : false), 'ul-children');
                              
                                          if(typeof(value.children) != "undefined" && value.children != null){
                                    
                                                $.each(value.children, function(index, children){
                                          
                                                      ul_children = self.html_ul(li_father, 'ul-children');
                                                      ul_children.css('display', 'none');           
                                                      li_children = self.html_li(ul_children);
                                                      span_children = self.html_span(li_children);
                                                      label_children = self.html_label(span_children, children.module_name);
                                          
                                                      if(typeof(children.actions) != "undefined" && children.actions != null){
                                                
                                                            self.html_icon(span_children, true, 'ul-action-children');
                                                
                                                            ul_action = self.html_ul(li_children, 'ul-action-children');
                                                            ul_action.css('display', 'none');
                                                
                                                            $.each(children.actions, function(i, actions){
                                                      
                                                                  li_action = self.html_li(ul_action);
                                                                  span_action = self.html_span(li_action);
                                                                  label_action = self.html_label(span_action, actions.action_name);
                                                      
                                                                  check_action = $('<input type="checkbox" name="exceptions[' + children.m_id + '][' + actions.action_id + ']" /> ').css({
                                                                        'margin-right':'5px'
                                                                  }).val(actions.action_id).prependTo(label_action);
                                                      
                                                                  if(actions.permit){
                                                            
                                                                        check_action.attr('checked', true);
                                                                  }
                                                            });
                                                      }
                                                });
                                          }
                                    });
                        
                                    div_main.dialog({
                                          autoOpen: true,
                                          modal: true,
                                          title: employee_name,
                                          width: 700,
                                          height: 'auto',
                                          maxHeight: 0,
                                          resizable: false,
                                          create: function() {
                                                $(this).css("maxHeight", 600);        
                                          },
                                          position: 'top',
                                          show: "blind",
                                          buttons: [{
                                                text: 'Cancelar',
                                                click: function () {
                                                      div_main.dialog('close');
                                                      div_main.remove();
                                                }
                                          },{
                                                text: 'Agregar Exepciones',
                                                click: function () {
                                                      self.add(role_id, employee_id, form);
                                                      div_main.dialog('close');
                                                      div_main.remove();
                                                }
                                          }],
                                          close: function(){
                                                div_main.remove();
                                          }
                                    });
                              },
                  
                              html_ul: function(li, addclass){
                        
                                    return $('<ul></ul>').addClass(addclass).appendTo(li); 
                              },
                  
                              html_li: function(ul){
                        
                                    return $('<li></li>').appendTo(ul);
                              },
                  
                              html_label: function(span, name){
                        
                                    return $('<label></label>').text(name).css('width', '80%').css('cursor', 'pointer').appendTo(span);
                              },
                  
                              html_span: function(li, name){
                        
                                    return $("<span></span>").addClass('ui-state-default').css('margin-top', '10px').css('padding-left', '10px').css('padding-top', '10px').css('padding-bottom', '10px').css('display', 'block').appendTo(li);
                              },
                  
                              html_icon: function(label, add_class, class_name){
                        
                                    var span = $("<span></span>").css('width', '10%').css('float', 'right').css('margin-top', '-15px').css('display', 'block').css('cursor', 'pointer').appendTo(label);
                        
                                    if(add_class){
                              
                                          span.addClass('icon-arrow-up');
                                    }
                        
                                    span.click(function(){
                              
                                          var obj = $(this)
                                          var style = obj.attr('class');
                              
                                          if(style == 'icon-arrow-down'){
                                    
                                                obj.removeClass('icon-arrow-down');
                                                obj.addClass('icon-arrow-up');
                                    
                                                li = obj.parent().parent();
                                                li.find('.' + class_name).slideUp();
                                          } else {
                                    
                                                obj.removeClass('icon-arrow-up');
                                                obj.addClass('icon-arrow-down');
                                    
                                                li = obj.parent().parent(); 
                                                li.find('.' + class_name).show('slow');
                                          }
                                    });
                              },
                  
                              html_check: function(label, id, module_id){
                        
                                    return $('<input type="checkbox" id="checkbox" name="modules[]" /> ')
                                    .css({
                                          'margin-right':'5px'
                                    })
                                    .val(id)
                                    .prependTo(label);
                              },
                  
                              /**
                              *  @name add
                              *  @description funcion que se encarga de guardar las exepciones del empleado de un modulo en particular para un rol
                              *  @param role_id identificador del rol
                              *  @param employee_id identificador del empleado
                              *  @param form objeto javascript del formulario
                              */
                              add: function(role_id, employee_id, form){
                        
                                    var data = form.serialize();
                        
                                    $.ajax({
                                          url: _options.roles.url.exceptions_add,
                                          type:'POST',
                                          async:false,
                                          data: 'role_id='+ role_id +'&employee_id=' + employee_id +'&'+ data,
                                          dataType:'json',
                                          success: function(data){
                                    
                                                $.msgbox(data.msg);
                                          },
                                          error: function(){
                                                $.msgbox("Problemas de conexion con el servidor al dar de alta las excepciones.");
                                          }
                                    });
                              }
                        }
                  } // fin funciones asignar
            }
            
      }// fin del objeto return
      
})();