$(document).ready(function(){
      
      $('#tabs').tabs();
      
      var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
      var empresa = $('#tabs').find('form#Form00').find('.control-group').find('.controls').find('select#DepartamentoGralEmpresaId');
      var sucursales = $('#tabs').find('form#Form00').find('.control-group').find('.controls').find('select#DepartamentoGralSucursalId');
      
       empresa.change(function(){
          
           sucursales.empty();
           loadCbox(base_url + 'Departamentos/getSucursales/' + ($(this).val()), sucursales);
      });
      
       var loadCbox = function(url, item){
            $.ajax({
                  url: url,
                  dataType:"JSON",
                  type:"POST",
                  async:false,
                  success:function(request){  
                      
                        $('<option></option>').val('').text('-Seleccione-').appendTo(item);
                        $.each(request, function(key, value){
                              $('<option></option>').val(key).text(value).appendTo(item);
                        });
                  }
            });
      }
 });