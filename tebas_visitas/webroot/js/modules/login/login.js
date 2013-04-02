$(document).ready(function(){
      
      var username = $('#username');
      var password = $('#password');
      var acceder = $('#acceder');
      var base_url = document.location.protocol + '//' + document.location.host + '/';
      
      acceder.click(function(e){
         
            e.preventDefault();
         
            $.ajax({
                  url: base_url + 'login/index/',
                  type: 'POST',
                  dataType: 'JSON',
                  data: {
                        username: username.val(),
                        password: password.val()
                  },
                  success: function(data){
                        
                        if(data.success){
                              
                             window.location.href = base_url + 'panel/index/'
                             
                        } else {
                              
                              $.msgbox(data.msg);
                        }
                  },
                  error: function(){
                       
                        $.msgbox("Problemas de conexion con el Servidor.");
                  }
            });
      });
      
});// fin document ready