$(document).ready(function(){
      
      $('#tabs').tabs();
      
      var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
      var empresas = $("#tabs").find("div#tabs-1").find("div.row-fluid").find("div.control-group").find("div.controls").find("#ConfiguracioneEmpresaId");
     
      var divContainer = $("body").find("div#wrapper").find("section#content").find("div.container");
     
      empresas.change(function(){
            var viewCtp = '';
            $.ajax({
                  url: base_url + 'configuraciones/edit',
                  dataType:"html",
                  type:"POST",
                  async:false,
                  success:function(viewCtpCakephp){  
                        viewCtp = viewCtpCakephp;
                  }
            });
            divContainer.empty();
            divContainer.html(viewCtp);
      });

      
});