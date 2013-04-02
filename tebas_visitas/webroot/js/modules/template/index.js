$(document).ready(function(){
      
      
      // para evitar que se ejecute el evento al dar click en el li del menu despues sera quitado
      $('.dropdown li, .dropdown input, .dropdown label, .dropdown select').click(function(e) {
            e.stopPropagation();
      });       
      
      var base_url = document.location.protocol + '//' + document.location.host + '/';
      
      $('#form-company-plant').find('#username').addClass('validate[required]');
      $('#form-company-plant').find('#password').addClass('validate[required]');
      $('#form-company-plant').find('#company_id').addClass('validate[required]');
      $('#form-company-plant').find('#plant_id').addClass('validate[required]');

      modules_template.init({login_company_plant:{}, messages_count:{}, messages_new:{}});
      
       $("#address-new").fcbkcomplete({
            json_url: base_url + "admin_catalogs/messages/fn_get_employees"
            , addontab: true
            , maxitems: 10
            , input_min_size: 0
            , cache: false
            , width:385
            , select_all_text: "Todos"
            , filter_selected : true
            , display_results:'block'
            , no_items:'No se encontraron Usuarios'
            , heigh: 100
      });
      
});