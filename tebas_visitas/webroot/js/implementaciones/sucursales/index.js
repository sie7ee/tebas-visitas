$(document).ready(function(){
      
      function raund(a,b) {
            return Math.round(Math.random()*(b-a)+a);
      }
      var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
      //var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/employees/fn_load_permits'); // se cargan los permisos
	  

      $("#catalog-table").jcatalogTable({
            title: 'Sucursales',
            paginate:{
                  order: 'DESC',
                  campo: 'Sucursal.id',
                  limit: 10,
                  offset: 0,
                  cbox_pagination:true
            },
            actions: {
                  listAction: base_url + 'Sucursales/listarRegistros'
            },
            
            buttons:{
                  add:{
                        title: 'Nuevo',
                        fn:function(obj_click, obj_plugin){
                              crudLibrary.add(base_url+"Sucursales/add/"+raund(1,90000));
                        },
                        permit: true
                  }
            },

            fields: {
                  titulo:{
                        title: 'Titulo',
                        width: '30%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'Sucursales.titulo'
                  },    
                  razonSocial:{
                        title: 'Empresa',
                        width: '30%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'Empresa.titulo'
                  },
                  created:{
                        title: 'Creación',
                        width: '20%',
                        sortable: true,
                        pivot: true,
                        pivot_title: 'Sucursales.created'
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
                              crudLibrary.view(base_url+"Sucursales/view/"+ data.id + "/" + raund(1,90000));
                        },
                        permit: true
                  },
                  edit:{
                        title:'Editar',
                        fn: function(data){
                              crudLibrary.edit(base_url+"Sucursales/edit/"+ data.id + "/" + raund(1,90000));
                        },
                        permit: true
                  },
                  
                  deleted:{
                        title:'Eliminar',
                        fn: function(data){
                              crudLibrary.deleted(base_url+"Sucursales/deleted/"+ data.id + "/" + raund(1,90000));
                        },
                        permit: true
                  }
            }
      });
      
      $("#catalog-table").jcatalogTable('load');
});