var prubea_grid = (function(){
      
      
      
      return {
            
            agrega_prod: function(nombreBoton,nombreGrid){
                  
                  $('#' + nombreBoton).click(function(){
                        
                        $('#' + nombreGrid).catalogoTable5('load');
                  });
            }
      }
})();