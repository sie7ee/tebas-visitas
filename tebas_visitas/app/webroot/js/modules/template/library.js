var modules_template = (function(){
    
      // base url del sistema 
      var _base_url = document.location.protocol + '//' + document.location.host + '/'; 
      
      /**
       * Objeto-json contendra todo el proceso de login para cambiar de usuario de empresa-planta
       */
      var _login_company_plant = {
            
            /**
             * Funcion que se encarga de iniciar el proceso de login al momento que el usuario da click
             * al link de empresa-planta
             */
            login: function(){
                  
                  var self = this;
                  
                  $('.login-empresa-planta').click(function(e){
                        e.preventDefault();
                        self.load_companies();
                        self.show_form();
                  });
            },
            
            /**
             * Funcion que se encarga de cargar las empresas que se encuentran almancenadas en la base de datos
             * para cargar el select
             */
            load_companies: function(){
                  
                  var self = this;
                  var company = $("#login-empresa-planta").find('#company_id');
                  var plant = $("#login-empresa-planta").find("#plant_id");
                  
                  company.empty();
                  plant.empty();
                
                  $.ajax({
                        url: _base_url + 'login/fn_load_companies',
                        type:'POST',
                        dataType:'JSON',
                        cache: false,
                        async: false,
                        success: function(data){
                        
                              if(data.success){
                              
                                    self._load_options(company, data);
                                    
                              } else {
                                    
                                    $.msgbox(data.msg);
                              }
                        },
                        error:function(){
                              $.msgbox("Problemas de conexion con el servidor al tratar de cargar las empresas.");
                        }
                  });
                  
                  company.change(function(){
                        
                        self.load_plants();
                  });
            },
          
            /**
             * Funcion que se encarga de cargar las plantas de acuerdo a la empresa seleccionada en el campo select del formulario
             */
            load_plants: function(params){
                  
                  var self = this;
                  var company_id = $("#login-empresa-planta").find('#company_id').val();
                  var plant = $("#plant_id");
                  
                  plant.find('option').remove();
                  
                  $.ajax({
                        url: _base_url + 'login/fn_load_plants',
                        type:'POST',
                        dataType:'JSON',
                        cache: false,
                        async: false,
                        data:{
                              company_id: company_id
                        },
                        success: function(data){
                              
                              if(data.success){
                                    
                                    self._load_options(plant, data);
                                    
                              } else {
                                    
                                    $.msgbox('No se encontraron plantas asociadas a esta empresa');
                              }
                        },
                        error:function(){
                              $.msgbox("Problemas de conexion con el servidor al tratar de cargar las plantas.");
                        }
                  });
            },
            
            /**
             * Funcion utilitaria que sirve para cargar los datos en un campo select
             */
            _load_options: function(item, data){
                  
                  $('<option></option>').text('-Seleccione-').val('').appendTo(item);       
                  $.each(data.data, function(index, value){  
                        $('<option></option>').text(value.description).val(value.id).appendTo(item);
                  });
            },
            
            /**
             * Funcion que se encarga de mostrar el formulario de login mediante el plugin dialog de jquery
             */
            show_form: function(params){
                  
                  var self = this;
                  var div = $("#login-empresa-planta");
                  
                  utils_library.form.validation_engine("form-company-plant");

                  div.dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Login',
                        width: 350,
                        height: 400, 
                        buttons: [{
                              text: 'Acceder',
                              click: function () {
                                    
                                    if(utils_library.form.validation_save_click("form-company-plant")){
                                                
                                          $.msgbox("Estas por acceder a otra planta automaticamente se cerrara la session actual. ¿Deseas continuar?",
                                          {
                                                type: "confirm",
                                                buttons : [ {
                                                      type: "submit", 
                                                      value: "Aceptar"
                                                },{
                                                      type: "cancel", 
                                                      value: "Cancel"
                                                }]
                                          }, 
                                          function(result) {
                  
                                                if(result === "Aceptar"){
                                                      
                                                      self.ajax_login(params);
                                                }
                                          });
                                    } 
                              }
                        },{
                              text: 'Cerrar',
                              click: function () {
                                    
                                    $('#company_id').find('option').remove();
                                    $('#plant_id').find('option').remove();
                                    
                                    utils_library.form.validation_clear_alerts("form-company-plant");
                                    utils_library.form.clear("form-company-plant");
                                    
                                    div.dialog('close');
                              }
                        }],
                        close: function(){
                              
                              $('#company_id').find('option').remove();
                              $('#plant_id').find('option').remove();
                              
                              utils_library.form.validation_clear_alerts("form-company-plant");
                              utils_library.form.clear("form-company-plant");
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de realizar la peticion al controller de login para cambiar de empresa-planta
             */
            ajax_login: function(){
                  
                  var form_data = $("#form-company-plant").serialize();
                  
                   $.ajax({
                        url: _base_url + 'login/index/',
                        type: 'POST',
                        dataType: 'JSON',
                        cache: false,
                        async: false,
                        data: form_data,
                        success: function(data){
                              
                              if(data.success){
                                    window.location.reload();
                                    window.location.reload();
                              } else {
                                    $.msgbox(data.msg);
                              }
                        },
                        error: function(){
                             
                              $.msgbox("Problemas de conexion con el Servidor.");
                        }
                  });
            }
      } // proceso login empresa planta
      
      /**
       * Objeto-json tipo privado que se encarga de 
       */
      var _messages = {
            
            count_messages: function(){
                  
                  window.setInterval(this.messages_load, 60000);
            },
            
            messages_load: function(){
                  
                  var badge = $('#top-nav').find('.pull-right').find('li').find('a').find('.badge').text();
                  var count_bage = parseInt(badge);
                  
                  $.ajax({
                        url: _base_url + 'admin_catalogs/messages/fn_messages_count',
                        type:'POST',
                        dataType:'JSON',
                        success: function(data){
                              
                              var new_message = parseInt(data.data);
                              
                              $('#top-nav').find('.pull-right').find('li').find('a').find('.badge').text(new_message);
                              
                              if(count_bage < new_message){
                                    
                                    $.msgGrowl ({
                                          type: '', 
                                          title: 'Nuevo(s) Mensaje(s)', 
                                          text: 'Acabas de recibir (' + new_message + ') Mensaje(s)'
                                    });
                              }
                        }
                  });
            },
            
            messages_new: function(){
                  
                  var self = this;
                  var div = $("#div-message-new");
                  var select_address = $("#form-message-new").find("#address-new");
                  var ul_holder = $(".holder");
                  
                  select_address.empty();
                  ul_holder.find(".bit-box").remove();
                  
                  $('#message-new').click(function(){
                        
                        utils_library.fck_autocomplete.removeAllItems("form-message-new", "address-new");// esto se agrego por el uso del plugin
                        
                        div.dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Nuevo',
                              width: '450px',
                              buttons: [{
                                    text: 'Cerrar',
                                    click: function () {
                                         
                                          utils_library.fck_autocomplete.removeAllItems("form-message-new", "address-new");// esto se agrego por el uso del plugin
                                          utils_library.form.validation_clear_alerts("form-message-new");
                                          utils_library.form.clear("form-message-new");
                                          div.dialog('close');
                                    }
                              },{
                                    text: 'Enviar',
                                    click: function () {
                                     
                                          self.enviados_add_save_submit(div);
                                    }
                              }],
                              close: function(){
                                    
                                    utils_library.fck_autocomplete.removeAllItems("form-message-new", "address-new");// esto se agrego por el uso del plugin
                                    utils_library.form.validation_clear_alerts("form-message-new");
                                    utils_library.form.clear("form-message-new");
                              }
                        });
                  });
            },
            
            /**
             * Funcion que se encarga de realizar la peticion ajax para guardar los nuevos datos
             * 
             * @param div
             */
            enviados_add_save_submit: function(div){
                  
                  var self = this;
                  var dataForm = $("#form-message-new").serialize();
                  
                  $.ajax({
                        url: _base_url + 'admin_catalogs/messages/add',
                        type:'POST',
                        data: dataForm,
                        async: false,
                        dataType: 'json',
                        success: function(data){ 
                              
                              self.enviados_add_save_success(div, data);
                        },
                        error: function(){
                              
                              $.msgbox("Se sucito un error con el servidor al momento de tratar de guardar el mensaje");  
                        }
                  });
            },
            
            /**
             * @name enviados_add_save_success
             * @description Funcion que se encarga de mandar un mensaje despues de aver ingresado los datos
             * @param div
             * @param data
             */
            enviados_add_save_success: function(div, data){

                  if(data.success){
                        
                        utils_library.form.validation_clear_alerts("form-message-new");
                        utils_library.form.clear("form-message-new");
                        div.dialog('close');
                        
                        $.msgbox('Mensaje Enviado.');  
                        
                  } else {
                        
                        $.msgbox(data.msg);  
                  }
            }
      }// fin proceso de mesajes
      
      /**
       * Objeto-json que se encarga d
       */
      var _start = {
           
            /**
             *
             */
            login_company_plant: function(){
                  
                 _login_company_plant.login();
            },
            
            /**
             *
             */
            messages_count: function(){ 
                  
                  _messages.count_messages();
            },

            /**
             * 
             */
            messages_new: function(params){
                  
                  _messages.messages_new(params);
            }
      };  
    
    /**
     * Se retorna un objeto-json con funciones publicas para ser accedidas desde el index.js
     */
      return {
        
            /**
             * Funcion contructor de la clase
             */
            init: function(c){
                  
                  this._run(c);
            },
        
            /**
             * Funcion privada que se encarga mandar llamar las funciones que se ejecutaran al momento de iniciar el modulo
             */
            _run: function(c){
                  
                  $.each(c, function(index, value){
                        _start[index](value);
                  });
            }
      };
})();