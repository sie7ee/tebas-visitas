$(document).ready(function(){
      
      function raund(a,b) {
            return Math.round(Math.random()*(b-a)+a);
      }
      var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
      //var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/employees/fn_load_permits'); // se cargan los permisos
	  

      $("#catalog-table").jcatalogTable({
            title: 'Empresas',
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            actions: {
                  listAction: base_url + 'empresas/listarRegistros'
            },
            
            buttons:{
                  add:{
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              crudLibrary.add(base_url+"empresas/add/"+raund(1,90000));
                        },
                        permit: true
                  }
            },

            fields: {
                  razonSocial:{
                        title: 'Razon Social',
                        width: '35%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'empresas.rasonzocial'
                  }, 
                  
                  rfc:{
                        title: 'Rfc',
                        width: '25%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'empresas.rfc'
                  },                  
                  telefono:{
                        title: 'Telefono',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'empresas.telefono'
                  },
                  actionsRows:{
                        title: 'Acciones',
                        width: '20%'
                  }
            },
            
            actionsRows:{
                  
                  view:{
                        title:'Ver',
                        fn: function(data){
                              crudLibrary.view(base_url+"empresas/view/"+ data.id + "/" + raund(1,90000));
                              $('#tabs').tabs();
                        },
                        permit: true
                  },
                  edit:{
                        title:'Editar',
                        fn: function(data){
                              
                              crudLibrary.edit(base_url+"empresas/edit/"+ data.id + "/" + raund(1,90000));
                              $('#tabs').tabs();
                        },
                        permit: true
                  },
                  
                  deleted:{
                        title:'Eliminar',
                        fn: function(data){
                              
                              crudLibrary.deleted(base_url+"empresas/deleted/"+ data.id + "/" + raund(1,90000));
                              $('#tabs').tabs();
                        },
                        permit: true
                  }
            }
      });
      
      $("#catalog-table").jcatalogTable('load');
});