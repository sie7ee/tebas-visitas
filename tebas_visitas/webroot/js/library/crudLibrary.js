var crudLibrary = (function(){

      var _options = {
            divCatalogCrud: 'library-catalog-crud',
            divCatalogTable: 'catalog-table'
      }
      
      var _crud = {
            
            _$idDivFormClone:{},
            _$idFormClone:{},      
            /**
             * Funcion que se encarga de hacer la peticion ajax para cargar la vista .ctp de cakephp
             */
            loadView:function(url){
                  var viewCtp = '';
                  $.ajax({
                        url: url,
                        dataType:"html",
                        type:"POST",
                        async:false,
                        success:function(viewCtpCakephp){  
                             viewCtp = viewCtpCakephp;
                        }
                  });
                  return viewCtp;
            },
            /**
             * Funcion que se encarga de colocar la vista .ctp en el div contenedor que se utilizara para el proceso de crud
             * 
             * @param viewCtp vista .ctp devuelta mediante ajax por el framework 
             */
            showView: function(viewCtp){
                  
                  // recuperamos los divs
                  var divCatalogCrud = _options.divCatalogCrud;
                  var divCatalogTable = _options.divCatalogTable;
                  
                  // se coloca el formulario en el div contenedor y se oculta el grid y se muestra el formulario
                  $('#' + divCatalogCrud).html(viewCtp);
                  $('#' + divCatalogTable).hide('slow');
                  $('#' + divCatalogCrud).show('slow');
            },
            
            processAdd: function(){
                  
                  // recuperamos los divs
                  var divCatalogCrud = _options.divCatalogCrud;
                  var divCatalogTable = _options.divCatalogTable;
                  // buscamos el formulario y los botones de aceptar y cancelar
                  var form = $('#' + divCatalogCrud).find('form');
                  var btnGuardar = form.find('div#acciones').find('#guardar');
                  var btnCancelar = form.find('div#acciones').find('#cancelar');
                  
                  // sele agrega funcionalidad al boton de aceptar
                  btnGuardar.click(function(){
                        form.ajaxForm({
                              dataType:'json',
                              success:function(request){
                                    if(request.success){
                                          $("#" + _options.divCatalogTable).jcatalogTable("reload");
                                          $('#' + divCatalogCrud).hide('slow');
                                          $('#' + divCatalogTable).show('slow');
                                          $.msgbox(request.msg);
                                    } else {
                                        form.find('span[id=sp_error]').css('display','none').text("");
                                        if(typeof request.Errores != 'undefined'){
                                                $.each(request.Errores, function(key,value) {										 
                                                      form.find('span[name="'+key+'"]').css('display','block').text(value);		
                                                });
                                        }								
                                        $.msgbox(request.msg);
                                    }
                              }
                        });
                  });
                  
                  // se le agrega funcionalidad al boton de cancelar
                  btnCancelar.click(function(){
                        $('#' + divCatalogCrud).hide('slow');
                        $('#' + divCatalogTable).show('slow');
                  });
            },
            
            processEdit: function(){
                  
                  // recuperamos los divs
                  var divCatalogCrud = _options.divCatalogCrud;
                  var divCatalogTable = _options.divCatalogTable;
                  // buscamos el formulario y los botones de aceptar y cancelar
                  var form = $('#' + divCatalogCrud).find('form');
                  var btnGuardar = form.find('div#acciones').find('#guardar');
                  var btnCancelar = form.find('div#acciones').find('#cancelar');
                  
                  // sele agrega funcionalidad al boton de aceptar
                  btnGuardar.click(function(){
                        form.ajaxForm({
                              dataType:'json',
                              success:function(request){
                                    if(request.success){
                                          $("#" + _options.divCatalogTable).jcatalogTable("load");
                                          $('#' + divCatalogCrud).hide('slow');
                                          $('#' + divCatalogTable).show('slow');
                                          $.msgbox(request.msg);
                                    } else {
                                        form.find('span[id=sp_error]').css('display','none').text("");
                                           if(typeof request.Errores != 'undefined'){
                                                $.each(request.Errores, function(key,value) {										 
                                                      form.find('span[name="'+key+'"]').css('display','block').text(value);		
                                                });
                                          }									
                                          $.msgbox(request.msg);
                                    }
                              }
                        });
                  });
                  
                  // se le agrega funcionalidad al boton de cancelar
                  btnCancelar.click(function(){
                        $('#' + divCatalogCrud).hide('slow');
                        $('#' + divCatalogTable).show('slow');
                  });
            },
            
            processView:function(){
                  
                  // recuperamos los divs
                  var divCatalogCrud = _options.divCatalogCrud;
                  var divCatalogTable = _options.divCatalogTable;
                  
                  // buscamos el formulario y los botones de aceptar y cancelar
                  var btnGuardar = $("#" + divCatalogCrud).find('div#acciones').find('#guardar');
                  var btnCancelar = $("#" + divCatalogCrud).find('div#acciones').find('#cancelar');
                  
                  // se le agrega funcionalidad al boton de cancelar
                  btnCancelar.click(function(){
                        $('#' + divCatalogCrud).hide('slow');
                        $('#' + divCatalogTable).show('slow');
                  });
            },
            
            processDeleted:function(){
                   // recuperamos los divs
                  var divCatalogCrud = _options.divCatalogCrud;
                  var divCatalogTable = _options.divCatalogTable;
                  
                  // buscamos el formulario y los botones de aceptar y cancelar
                  var form = $('#' + divCatalogCrud).find('form');
                  var btnGuardar = form.find('div#acciones').find('#guardar');
                  var btnCancelar = form.find('div#acciones').find('#cancelar');
                  
                  // sele agrega funcionalidad al boton de aceptar
                  btnGuardar.click(function(){
                        form.ajaxForm({
                              dataType:'json',
                              success:function(request){
                                    if(request.success){
                                          $("#" + _options.divCatalogTable).jcatalogTable("load");
                                          $('#' + divCatalogCrud).hide('slow');
                                          $('#' + divCatalogTable).show('slow');
                                          $.msgbox(request.msg);
                                    } else {	
                                          $.msgbox(request.msg);
                                    }
                              }
                        });
                  });
                  
                  // se le agrega funcionalidad al boton de cancelar
                  btnCancelar.click(function(){
                        $('#' + divCatalogCrud).hide('slow');
                        $('#' + divCatalogTable).show('slow');
                  });
            }
      } 
      
      
      return {
            
            /**
             * 
             */
            init:function(params){
                  _options = $.extend(true, params, _options);
            },
            
            /**
             *  Funcion que se encarga del proceso de Nuevo
             *  @param url direccion del controller para agregar un nuevo registro
             */
            add: function(url){
                  var viewCtp = _crud.loadView(url);
                  _crud.showView(viewCtp);
                  _crud.processAdd();
            },
            
            /**
             * Funcion que se encarga del proceso de editar
             *  @param url direccion del controller para agregar un nuevo registro
             */
            edit: function(url){
                   var viewCtp = _crud.loadView(url);
                  _crud.showView(viewCtp);
                  _crud.processEdit();
            },
            
            view: function(url){
                  var viewCtp = _crud.loadView(url);
                  _crud.showView(viewCtp);
                  _crud.processView();
            },
            
            deleted: function(url){
                   var viewCtp = _crud.loadView(url);
                  _crud.showView(viewCtp);
                  _crud.processDeleted();
            }
      }
})();