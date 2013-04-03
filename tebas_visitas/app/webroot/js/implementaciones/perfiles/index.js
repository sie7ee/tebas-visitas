$(document).ready(function(){      
      function raund(a,b) {
            return Math.round(Math.random()*(b-a)+a);
      }
	  	
      var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
      //var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/employees/fn_load_permits'); // se cargan los permisos
	  
      $("#catalog-table").jcatalogTable({
            title: 'perfiles',
            paginate:{
                  order: 'DESC',
                  campo: 'id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            actions: {
                  listAction: base_url + 'perfiles/main'
            },
            
            buttons:{
                  add:{
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              crudLibrary.add(base_url+"perfiles/add/"+raund(1,90000));
                        },
                        permit: true
                  }
            },

            fields: {
                  descripcion:{
                        title: 'Descripcion',
                        width: '35%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'Perfile.descripcion'
                  }, 
                  
                  created:{
                        title: 'Rfc',
                        width: '25%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'Perfile.created'
                  },                  
                  modified:{
                        title: 'Telefono',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'Perfile.modified'
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
                              crudLibrary.view(base_url+"perfiles/view/"+ data.id + "/" + raund(1,90000));
                              $('#tabs').tabs();
                        },
                        permit: true
                  },
                  edit:{
                        title:'Editar',
                        fn: function(data){
                              
                              crudLibrary.edit(base_url+"perfiles/edit/"+ data.id + "/" + raund(1,90000));
                              $('#tabs').tabs();
                        },
                        permit: true
                  },
                  
                  deleted:{
                        title:'Eliminar',
                        fn: function(data){
                              
                              crudLibrary.deleted(base_url+"perfiles/deleted/"+ data.id + "/" + raund(1,90000));
                              $('#tabs').tabs();
                        },
                        permit: true
                  }
            }
      });
      
      $("#catalog-table").jcatalogTable('load');
});