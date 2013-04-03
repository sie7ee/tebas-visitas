/**
 * module_roles
 * 
 * Objeto en javascript encargado del proceso de la funcionalidad crud del modulo roles ademas de otros procesos
 * como de crear la relacion de modulos-roles para la asignacion de que modulos perteneceran a un rol, tambien es 
 * usado para el proceso de asignar empleados a un rol y asignar que exepciones tendra un empleado en caso de que
 * se requira limitar su acceso a ciertas funciones en el sistema
 * 
 * @date 23/11/2012
 * @author Gustavo avila Medina <gustavo_bam87@hotmail.com>
 */
var module_roles = (function(){
      
      /**
       * Objeto typo privado que tendra las opciones de configuracion de la clase que se utilizaran en el proceso de crud
       */
      var _options = {}
      
      
      /**
       * Objeto json typo privado que se encarga de la funcionalidad del proceso de definir que modulos seran 
       * asignados a un rol para crear la relacion modules-role 
       */ 
      var _definir = {            
            
            /**
             * Funcion que se encarga de realizar la peticion ajax al servidor para cargar los datos de los modulos
             * dados de alta en el sistema y cuales estan ya asignado a un rol
             * 
             * @param role_id integer identificador del rol al cual se recuperara que modulos estan asignados a el
             * @param role_name string nombre del rol
             */
            load_modules: function(role_id, role_name){
                  
                  var self = this;
                  $.ajax({
                        url: _options.url.definir_get_modules,
                        type:'POST',
                        async:false,
                        data: 'role_id='+role_id,
                        success: function(data){
                              self.html_success(role_id, role_name, data);
                        },
                        error: function(){
                              $.msgbox(_options.msg.definir_error);
                        }
                  });
            },
            
            /**
             * Funcion que se encarga de construir el html para crear la lista ul que contendra los modulos del sistema
             * y de seleccionar en el check del form que modulos estan asignados a este rol
             * 
             * @param role_id identificador del rol al cual sele asignaran los modulos que se seleccionen
             * @param role_name string nombre del rol
             * @param data datos de los modulos con los que cuenta el sistema actualmente
             */
            html_success: function(role_id, role_name, data){
                  
                  var self = this;
                  var request = $.parseJSON(data);
                  var div_main = $('#' + _options.items.div_main);
                  
                  // validamos si el query se realizo con exito
                  if(request.success){
                    
                        var div = $('<div></div>').appendTo(div_main);
                        var form = $('<form></form>').attr({
                              id:'form-module'
                        }).appendTo(div);
                        var ul_father = $('<ul></ul>').attr({
                              id: 'sortable'
                        }).appendTo(form);
                        
                        $.each(request.data, function(key, value){
                        
                              li_father = self.html_li(ul_father);
                              span_father = self.html_span(li_father);
                              label_father = self.html_label(span_father, value.module_name);
                                   
                              self.html_icon(span_father, (value.is_father == 't' ? true : false), 'ul-children');
                              
                              check_father = self.html_check(label_father, value.id, value.module_id, false);
                              check_father.change(function(){
                                                                  
                                    if($(this).is(':checked')){

                                          $(this).parent().parent().parent().find('ul.ul_children').find('li').find('.check-children-' + value.id).attr('checked', true);
                                          
                                    } else {

                                          $(this).parent().parent().parent().find('ul.ul_children').find('li').find('.check-children-' + value.id).attr('checked', false);

                                    }
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
                                    
                                          check_children = self.html_check(label_children, children.id, children.father_id, true);
                                          check_children.click(function(){

                                                if($(this).is(':checked')){

                                                      $(this).parent().parent().parent().parent().parent().find('.check-father-' + children.father_id).attr('checked', true);
                                          
                                                } else {
                                                      
                                                      if(! $(this).parent().parent().parent().parent().find('li').find('.check-children-' + children.father_id).is(':checked')){
                                                            
                                                            $(this).parent().parent().parent().parent().parent().find('.check-father-' + children.father_id).attr('checked', false);
                                                      }

                                                }
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
            
            html_check: function(label, id, father_id, is_children){
                  
                  var check = $('<input type="checkbox" id="checkbox" name="modules[]" /> ')
                  .css({
                        'margin-right':'5px'
                  })
                  .val(id)
                  .prependTo(label);
                  
                  if(is_children){
                        
                        check.addClass('check-children-' + father_id);
                        
                  } else {
                        
                        check.addClass('check-father-' + id);
                        
                  }
                  
                  return check;
            },
            
            /**
             * Funcion que se encarga de realizar la peticion ajax para guardar la definicion de que modulos
             * que van a pertencer al rol seleccionado
             * 
             * @param role_id identificador del rol en el cual se definiran los modulos
             * @param form objeto del formulario que se creo para seleccionar los checbox de los modulos
             */
            add_modules: function(role_id, form){
                  
                  var data = form.serialize();
                  
                  $.ajax({
                        url: _options.url.definir_add_modules,
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
      }// termina funciones definir
      
      var _asignar = {
            
            /**
             * Funcion que se encarga de realizar la peticion ajax al servidor para traer a los empleados de la planta
             * para asignarles un rol en particular
             * 
             * @param role_id identificador del rol
             * @param role_name nombre del rol
             */
            load_employees: function(role_id, role_name){
                  
                  var self = this;
                  
                  $.ajax({
                        url: _options.url.asignar_get_employees,
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
             * Funcion que se encarga de construir el html para crear la lista ul que contendra a los empleados de la planta
             * y de seleccionar en el check del form los empleados a los cuales seles asignara un rol en particular
             * 
             * @param role_id identificador del rol
             * @param data objeto json con los datos arrojados en el query
             * @param role_name nombre del rol
             */
            html_success: function(role_id, role_name, data){
                  
                  var self = this;
                  var request = $.parseJSON(data);
                  var div_main = $('#' + _options.items.div_main);
                  
                  // validamos si el query se realizo con exito
                  if(request.success){
                        
                        var div = $('<div></div>').appendTo(div_main);
                        var form = $('<form></form>').attr({
                              id:'form-employee'
                        }).appendTo(div);
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
                                          _exceptions.for_employee(role_id, value.id, employee_name);
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
             * Funcion que se encarga de realizar la peticion ajax para asignar que empleados con taran con el rol
             * seleccionado
             * 
             * @param role_id identificador del rol 
             * @param form objeto del formulario que se creo para seleccionar los checbox de los empleados
             */
            add_employees: function(role_id, form){
                  var data = form.serialize();
                  
                  $.ajax({
                        url: _options.url.asignar_add_employees,
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
      } // fin funciones asignar
      
      
      /**
       * Objeto json typo privado que se encarga de la funcionalidad del proceso de asignar excepciones a 
       * un empleado en particular para un modulo en un rol
       */ 
      var _exceptions = {
            
            /**
             * Funcion que se encarga de recuperar los modulos del sistema y las exepciones con las que cuenta un empleado
             * en caso de que tenga excepciones registradas para el modulo
             */
            for_employee: function(role_id, employee_id, employee_name){
                  
                  var self = this;
                  $.ajax({
                        url: _options.url.exeptions_get,
                        type:'POST',
                        async:false,
                        data: 'role_id='+ role_id +'&employee_id=' + employee_id,
                        dataType:'json',
                        success: function(data){
                              
                              self.html_success(role_id, employee_id, employee_name, data);
                        },
                        error: function(){
                              $.msgbox("Problemas de conexion con el Servidor al definir los modulos del rol.");
                        }
                  });
                  
                  
            },
            
            /**
             * Funcion que se encarga de crear el html de la lista de modulos y exepciones usa las clases de 
             * boostrap para poder dar el diseño y comportamiento de los tabs
             * 
             * @param role_id identificador del rol al cual pertenece el empleado y los modulos del rol
             * @param employee_id integer dentificador del empleado al cual sele asignaran las excepciones en un modulo en particular
             * @param employee_name string nombre del empleado
             * @param data resultado de los datos arrojados por el query
             */
            html_success: function(role_id, employee_id, employee_name, data){
                  
                  var self = this;
                  var div = $('#' + _options.items.div_main);
                  var div_main = $('<div></div>').appendTo(div); 
                  var form = $('<form></form>').appendTo(div_main);
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
             *  Funcion que se encarga de guardar las exepciones del empleado de un modulo en particular para un rol
             *  
             *  @param role_id identificador del rol
             *  @param employee_id identificador del empleado
             *  @param form objeto javascript del formulario
             */
            add: function(role_id, employee_id, form){
                  
                  var data = form.serialize();
                  
                  $.ajax({
                        url: _options.url.exceptions_add,
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
             * Funcion publica que e encarga de iniciar el proceso de definir que modulos seran asignado al rol 
             * seleccionado
             * 
             * @param params objeto json con los parametros necesarios para el proceso de eliminar
             *              -id identificador del rol
             */
            definir: function(params){
                  
                  var obj_click = params.obj_click;
                  var role_name = obj_click.parent().parent().find('td').eq(0).text();
                  
                  _definir.load_modules(params.id, role_name);
            },
            
            /** 
             * Funcion publica que e encarga de iniciar el proceso de asignar que empleados tendran el rol seleccionado
             * y tambien para poder asignar excepciones a un empleado siempre y cuando pertenesca ha este rol
             * 
             * @param params objeto json con los parametros necesarios para el proceso de eliminar
             *              -id identificador del rol
             */
            asignar: function(params){
                  
                  var obj_click = params.obj_click;
                  var role_name = obj_click.parent().parent().find('td').eq(0).text();
                  
                  _asignar.load_employees(params.id, role_name);
            }
      }
})();
