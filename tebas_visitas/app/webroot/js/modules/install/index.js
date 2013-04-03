$(document).ready(function(){

      var base_url = document.location.protocol + '//' + document.location.host + '/';
      var permits = {
            add: true,
            edit: true,
            view:true,
            deleted:true,
            pdf_grid: false,
            excel_grid: false
      }
      
      // agregamos las clases css que ocupa el plugin validateengine para la validacion de los formularios
      $('#catalogo-form-companies').find('#description-companies').addClass('validate[required]');

      $('#file_upload').uploadify({
            uploader : base_url + 'js/plugins/uploadify/uploadify.swf'
            , script : base_url + 'install/configuration/fn_do_upload'
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
            , onError : function (event, ID, fileObj, response, errorObj) {}
     });
      
      // se inicializa la clase pasando los parametros de configuracion
      install_module.init({
            
            permits:permits,
            
            companies:{

                  items: {
                        div_main: 'library-companies',
                        div_form: 'catalogo-div-form-companies',
                        form: 'catalogo-form-companies'
                  },
            
                  url:{
                        add: base_url + 'install/configuration/company_add',
                        view: base_url + 'install/configuration/company_view',
                        edit: base_url + 'install/configuration/company_edit',
                        del: base_url + 'install/configuration/company_delete'
                  },

                  msg:{
                        add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar la empresa.',
                        edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar la empresa.',
                        view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver la empresa.',
                        del_error: 'Se sucito un error al tratar de conectar con el servidor al momento de eliminar la empresa.',
                  
                        del_confirm:'Estas seguro de querer eliminar esta empresa.',
                        del_success:'El rol ha sido eliminado con exito.'
                  },
            
                  no_uppercase:false
            },
            
            plants:{
                  
                  items: {
                        div_main: 'library-plants',
                        div_form: 'catalogo-div-form-plants',
                        form: 'catalogo-form-plants'
                  },
                  
                  permits: permits,
            
                  url:{
                        add: base_url + 'install/configuration/plants_add',
                        view: base_url + 'install/configuration/plants_view',
                        edit: base_url + 'install/configuration/plants_edit',
                        del: base_url + 'install/configuration/plants_delete'
                  },

                  msg:{
                        add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar la planta.',
                        edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar la planta.',
                        view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver la planta.',
                  
                        del_confirm:'Estas seguro de querer eliminar esta planta.',
                        del_success:'La planta ha sido eliminado con exito.'
                  },
            
                  no_uppercase:false
            },
            
            employees:{
                  
                  items: {
                        div_main: 'library-employees',
                        div_form: 'catalogo-div-form-employees',
                        form: 'catalogo-form-employees'
                  },
                  
                  permits: permits,
            
                  url:{
                        add: base_url + 'install/configuration/employees_add',
                        view: base_url + 'install/configuration/employees_view',
                        edit: base_url + 'install/configuration/employees_edit',
                        del: base_url + 'install/configuration/employees_delete'
                  },

                  msg:{
                        add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar al empleado.',
                        edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el empleado.',
                        view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el empleado.',
                  
                        del_confirm:'Estas seguro de querer eliminar al empleado.',
                        del_success:'El empleado ha sido eliminado con exito.'
                  },
            
                  no_uppercase: ['email', 'local_email']
            },
            
            users:{
                
                  items: {
                        div_main: 'library-users',
                        div_form: 'catalogo-div-form-users',
                        form: 'catalogo-form-users',
                        select_fck: 'employee_id'
                  },
                  
                  permits: permits,
            
                  url:{
                        add: base_url + 'install/configuration/users_add',
                        view: base_url + 'install/configuration/users_view',
                        edit: base_url + 'install/configuration/users_edit',
                        del: base_url + 'install/configuration/users_delete'
                  },

                  msg:{
                        add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar el usuario.',
                        edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el usuario.',
                        view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el usuario.',
                  
                        del_confirm:'Estas seguro de querer eliminar este usuario.',
                        del_success:'El usuario ha sido eliminado con exito.'
                  },

                  no_uppercase: ['username', 'password', 'passconf']  
            },
            
            modules: {
                  
                  items: {
                        
                        div_main: 'library-modules',
                        div_form: 'catalogo-div-form-modules',
                        form: 'catalogo-form-modules',
                  
                        div_form_actions: 'catalogo-div-form-actions',
                        form_actions: 'catalogo-form-actions'
                  },
            
                  permits: permits,
            
                  url:{
                        add: base_url + 'install/configuration/modules_add',
                        view: base_url + 'install/configuration/modules_view',
                        edit: base_url + 'install/configuration/modules_edit',
                        del: base_url + 'install/configuration/modules_delete',
                  
                        definir_add: base_url + 'install/configuration/modules_definir_add',
                  
                        actions_load: base_url + 'install/configuration/modules_actions_load',
                        actions_edit: base_url + 'install/configuration/modules_actions_edit',
                        actions_del: base_url + 'install/configuration/modules_actions_del'
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
            },
            
            roles:{
                  
                  items: {
                  
                        div_main: 'library-roles',
                        div_form: 'catalogo-div-form-roles',
                        form: 'catalogo-form-roles'
                  },
                  
                  permits: permits,

                  url:{
                        add: base_url + 'install/configuration/roles_add',
                        view: base_url + 'install/configuration/roles_view',
                        edit: base_url + 'install/configuration/roles_edit',
                        del: base_url + 'install/configuration/roles_delete',
                  
                        definir_get_modules: base_url + 'install/configuration/roles_definir_load_modules',
                        definir_add_modules:  base_url + 'install/configuration/roles_definir_add_modules',
                  
                        asignar_get_employees: base_url + 'install/configuration/roles_asignar_load_employees',
                        asignar_add_employees:  base_url + 'install/configuration/roles_asignar_add_employees',
                  
                        exeptions_get: base_url + 'install/configuration/roles_excepcion_load',
                        exceptions_add: base_url + 'install/configuration/roles_excepcion_add'
                  },

                  msg:{
                        add_error:'Se sucito un error al tratar de conectar con el servidor al momento de agregar el rol.',
                        edit_error:'Se sucito un error al tratar de conectar con el servidor al momento de editar el rol.',
                        view_error:'Se sucito un error al tratar de conectar con el servidor al momento de ver el rol.',
                  
                        del_confirm:'Estas seguro de querer eliminar este rol.',
                        del_success:'El rol ha sido eliminado con exito.',
                  
                        definir_error: 'Se sucito un error al tratar de conectar con el servidor al momento de recuperar los modulos.'
                  },

                  no_uppercase:false   
            }
            
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table-companies").catalogoTable2({
            
            title: 'Tabla de Empresas',
            load_url: base_url + 'install/configuration/company_grid_paginate',
            
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 5,
                  offset: 0
            },
            
            columns: {
            
                  description:{
                        title: 'Descripcion de la empresa',
                        width: '45%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description'
                  }, 
                  created_date: {
                        title: 'Fecha Creacion',
                        width: '45%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.created_date'
                  },
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                  Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              install_module.companies.add(obj_click, obj_plugin);
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
                              
                              install_module.companies.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.companies.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
            }
      });
      
      // se inicializa la configuracion del plugin catalogoTable  
      $("#catalogo-table-plants").catalogoTable2({
            
            title: 'Tabla de Plantas',
            load_url: base_url + 'install/configuration/plants_grid_paginate',
         
            paginate:{
                  order: 'DESC',
                  campo: 'plants.id',
                  limit: 5,
                  offset: 0
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
                        pivot: true,
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
                              
                              install_module.plants.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  }
                 
            },
            
            actions_row:{
                  
                  View:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.plants.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.plants.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
                  
                  
            }
            
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table-employees").catalogoTable2({
            
            title: 'Tabla de Empleados',
            load_url: base_url + 'install/configuration/employees_grid_paginate',
            permits:permits,
         
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 5,
                  offset: 0
            },
            
            columns: {
            
                  name:{
                        title: 'Nombre',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.description'
                  }, 
                  
                  lastname_father:{
                        title: 'Apehido Paterno',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.description'
                  },
                  
                  lastname_mother:{
                        title: 'Apehido Materno',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'employees.description'
                  },
                  description_plant:{
                        title: 'Planta',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'plants.description'
                  },
                  description_company:{
                        title: 'Empresa',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description'
                  },
                  
//                  phone_number: {
//                        title: 'Numero Tel.',
//                        width: '11%',
//                        sortable: true,
//                        pivot: true,
//                        pivot_title: 'employees.created_date'
//                  },
//                  
//                  email: {
//                        title: 'Email',
//                        width: '11%',
//                        sortable: true,
//                        pivot: true,
//                        pivot_title: 'employees.created_date'
//                  },
                  
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                  Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              install_module.employees.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  },
            
                  Pdf:{
                        title: 'Pdf',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/employees/grid_get_pdf');
                        },
                        permit: permits.pdf_grid
                  },
                  Excel: {
                        title: 'Excel',
                        fn:function(obj_click, obj_plugin){
                              
                              window.open(base_url + 'admin_catalogs/employees/grid_get_excel');
                        },
                        permit: permits.excel_grid
                  }
            },
            
            actions_row:{
                  
                  View:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.employees.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.employees.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
                  
                  
            }
            
      });
      
      // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table-users").catalogoTable2({
            
            title: 'Tabla de Usuarios',
            load_url: base_url + 'install/configuration/users_grid_paginate',
         
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 5,
                  offset: 0
            },
            
            columns: {
            
                  username:{
                        title: 'Nombre de Usuario',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'users.description'
                  }, 
                  
                  employee_name:{
                        title: 'Empleado',
                        width: '33%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'users.description'
                  },
                  
                  description_plant:{
                        title: 'Planta',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'plants.description'
                  },
                  
                  description_company:{
                        title: 'Empresa',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description'
                  },
                  
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                  Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              install_module.users.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  }
            },
            
            actions_row:{
                  
                  View:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.users.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.users.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
            }
            
      });
      
       // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table-modules").catalogoTable2({
            
            title: 'Tabla de Modulos',
            load_url: base_url + 'install/configuration/modules_grid_paginate',
            
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 5,
                  offset: 0
            },
            
            columns: {
            
                  name:{
                        title: 'Nombre del Modulo',
                        width: '23%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'modules.name'
                  }, 
                  sys_name:{
                        title: 'Nombre del Systema',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'modules.sys_name'
                  },
                  is_father:{
                        title: 'Padre',
                        width: '8%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'modules.sys_name'
                  },
                  father_name: {
                        title: 'Padre',
                        width: '23%',
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
                              
//                              window.location.href = base_url + 'admin_catalogs/modules/add';
                                install_module.modules.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  }
            },
            
            actions_row:{
                  
                   Definir:{
                        title:'Definir',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.modules.definir.add({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                   View_actions:{
                        title:'Acciones',
                        fn: function(id, obj_click, obj_plugin){
                              
                              console.log(id);
                              console.log("id");
                              
                              install_module.modules.actions.load({
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
                              
                              install_module.modules.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.modules.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
            }
      });
      
        // se inicializa la configuracion del plugin catalogoTable 
      $("#catalogo-table-roles").catalogoTable2({
            
            title: 'Tabla de Roles',
            load_url: base_url + 'install/configuration/roles_grid_paginate',
            
            permits: permits,
         
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 5,
                  offset: 0
            },
            
            columns: {
            
                  name:{
                        title: 'Nombre del Rol',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'roles.name'
                  }, 
                  created_date: {
                        title: 'Fecha Creacion',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'roles.created_date'
                  },
                  description_plant:{
                        title: 'Planta',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'plants.description'
                  },
                  description_company:{
                        title: 'Empresa',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'companies.description'
                  },
                  actions: {
                        title: 'Acciones'
                  }
            },
            
            buttons: {
                  
                  Nuevo:{
                        
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              
                              install_module.roles.add(obj_click, obj_plugin);
                        },
                        permit: permits.add
                  }
            },
            
            actions_row:{
                  
                  Definir:{
                        title: 'Definir',
                        fn:function(id, obj_click, obj_plugin){
                               install_module.roles.definir.load_modules({
                                    id: id,
                                    obj_click: obj_click,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: true
                  },
                  
                  Asignar:{
                        title:'Asignar',
                        fn: function(id, obj_click, obj_plugin){
                             install_module.roles.asignar.load_employees({
                                    id: id,
                                    obj_click: obj_click,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: true
                  },
                  
                  View:{
                        title:'Ver',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.roles.view({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.view
                  },
                  
                  Eliminar:{
                        title:'Eliminar',
                        fn: function(id, obj_click, obj_plugin){
                              
                              install_module.roles.del({
                                    id: id,
                                    obj_plugin: obj_plugin
                              });
                        },
                        permit: permits.deleted
                  }
            }
            
      });
});