$(document).ready(function() {

    function raund(a, b) {
        return Math.round(Math.random() * (b - a) + a);
    }
    var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
    //var permits = utils_library.security.load_permits(base_url + 'admin_catalogs/employees/fn_load_permits'); // se cargan los permisos


    $("#catalog-table").jcatalogTable({
        title: 'Departamentos',
        paginate: {
            order: 'DESC',
            campo: 'Departamento.id',
            limit: 10,
            offset: 0,
            cbox_pagination: true
        },
        actions: {
            listAction: base_url + 'Departamentos/listarRegistros'
        },
        buttons: {
            add: {
                title: 'Nuevo',
                fn: function(obj_click, obj_plugin) {
                    crudLibrary.add(base_url + "Departamentos/add/" + raund(1, 90000));
                },
                permit: true
            }
        },
        fields: {
            titulo: {
                title: 'Nombre',
                width: '30%',
                sortable: true,
                pivot: true,
                pivot_title: 'Departamento.titulo'
            },
            
            created: {
                title: 'Creación',
                width: '20%',
                sortable: true,
                pivot: true,
                pivot_title: 'Departamento.created'
            },
            actionsRows: {
                title: 'Acciones',
                width: '20%'
            }
        },
        actionsRows: {
            view: {
                title: 'Ver',
                fn: function(data) {
                    crudLibrary.view(base_url + "Departamentos/view/" + data.id + "/" + raund(1, 90000));
                },
                permit: true
            },
            edit: {
                title: 'Editar',
                fn: function(data) {
                    crudLibrary.edit(base_url + "Departamentos/edit/" + data.id + "/" + raund(1, 90000));
                },
                permit: true
            },
            deleted: {
                title: 'Eliminar',
                fn: function(data) {
                    crudLibrary.deleted(base_url + "Departamentos/deleted/" + data.id + "/" + raund(1, 90000));
                },
                permit: true
            }
        }
    });

    $("#catalog-table").jcatalogTable('load');
});