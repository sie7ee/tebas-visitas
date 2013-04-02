<?php
App::uses('Model', 'Model');
class AppModel extends Model {
	
	function guardar($data){
		$result=array("success"=>false,"titulo"=>"Atencion!","msg"=>"Ocurrio un error al procesar el formulario.","cmdaceptar"=>__("Aceptar",true));
		try{
			if(!empty($data)):
				$this->create();
				if($this->save($data)):
					$result['success']=true;
					$result["msg"]=__("El registro con id [ ".$this->id." ] a sido procesado...",true);	
					$result["titulo"]=__("Informacion",true);
				else:							
					$result['Errores']= $this->validationErrors;
				endif;
			endif;
		}catch(Exception $e){
			$result["msg"]=$e->getMessage();	
		}
		return $result;
    }
	
	function eliminar($id){	
			$result=array('success'=>false,"titulo"=>"Atencion!","cmdaceptar"=>"Aceptar","msg"=>__("Ocurrio un error al intentar eliminar el registro [ ".$id." ]",true));				
			try {
				if($this->delete($id,true)):			
					$result['success']=true;
					$result['titulo']=__("Informaci&oacute;n.",true);	
					$result['msg']=__("Registro [ ".$id." ] a sido eliminado...",true);				
				endif;	
			}catch(Exception $e){
				$result['msg']=$e->getMessage();			
			}
		return $result;
	}		
	
}
