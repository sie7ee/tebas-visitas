$(document).ready(function() {
	var base_url = document.location.protocol + '//' + document.location.host + $("#hd_url_proyect").val();
	$('#acceder').live('click',function(event){	
		event.preventDefault();
		var options = { dataType : 'json', success :respuesta_procesada};
		$("Form").ajaxForm(options);
		$("#Form").submit();								
    });

	
   var respuesta_procesada=function(data){
        if(data.success){     
			$.msgbox(data.msg);
			$.msgBox({
				title:data.titulo,
				content:data.msg,
				type:"info"
			});			
        } else {                              
			$.msgbox(data.msg);
        }   
  }		
});