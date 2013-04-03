<?php
App::uses('CakeEmail', 'Network/Email');
App::import('CakeSession');
class Usuario extends AppModel{
	var $name = 'Usuario';
	var $displayField = 'descripcion'; 
     var $useTable = 'sysadmusuarios';
	var $belongsTo=array('Perfile'=>array('className' =>'Perfile','foreignKey'=>'perfil_id')/*,
						'Sucursale'=>array('className' =>'Sucursale','foreignKey'=>'sucursal_id')*/);		
	
	var $validate=array('nombre'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'El nombre ingresado no es valido!'
									)),
						'perfil_id'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'El perfil ingresado no es valido!'
									)),	
						'sucursal_id'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'La sucursal ingresada no es valida!'
									)),										
						'estatus'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'El esatus ingresado no es valido!'
									)),										
						'email'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'El correo electronico ingresado no es valido!'
									),
								'isUnique'=>array(
									'rule'=>"isUnique",
									'message'=>'El correo electronico ingresado ya existe!'
								),
								'email'=>array(
									'rule'=>"email",
									'message'=>'El correo electronico ingresado no es valido!'
								)),
						'clave_secreta'=>array(
								'isUniqueCustom'=>array(
									'rule'=>'isClaveSecretaIguales',
									'allowEmpty' => true,
									'message'=>'Las contrasenas ingresadas no coinciden!'
									),
								'minLength'=>array(
									'rule'=>array('minLength', '6'),																		
									'allowEmpty' => true,									
									'message'=>'La contrasena tiene que ser mayor de 6 digitos!'
									)									
									),
						'clave_secreta_repite'=>array(
								'isUniqueCustom'=>array(
									'rule'=>'isClaveSecretaIguales',
									'allowEmpty' => true,									
									'message'=>'Las contrasenas ingresadas no coinciden!'
									),
								'minLength'=>array(
									'rule'=>array('minLength', '6'),
									'allowEmpty' => true,									
									'message'=>'La contrasena tiene que ser mayor de 6 digitos!'
									)
									)
						);
							
    function isClaveSecretaIguales(){	
		$result=true;
		if(isset($this->data[$this->alias]['clave_secreta']) && isset($this->data[$this->alias]['clave_secreta_repite'])):
			$result=($this->data[$this->alias]['clave_secreta']==$this->data[$this->alias]['clave_secreta_repite']) ? true : false;
		endif;		
        return $result;
    }	

	
	function beforeSave($options = array()){
		if(isset($this->data[$this->alias]['id'])):	
			if($this->data[$this->alias]['clave_secreta']!=""  and $this->data[$this->alias]['clave_secreta_repite']!=""):				
				$this->data[$this->alias]['clave_secreta']=md5($this->data[$this->alias]['clave_secreta']);
			else:
				$this->id=$this->data[$this->alias]['id'];
				$clave_secreta=$this->field("clave_secreta");	
				$this->data[$this->alias]['clave_secreta']=$clave_secreta;
				$this->data[$this->alias]['clave_secreta_repite']=$clave_secreta;			
			endif;
		else:
			$this->data[$this->alias]['clave_secreta']=md5($this->data[$this->alias]['clave_secreta']);
		endif;
	
	}	
	
	function validar_login_form($data){		
		$result=$this->validate_sintaxis($data);
		if($result['success']):
			unset($result);
			$result=$this->validate_data_integrity($data);
		endif;
		return $result;
	}
	
	
	function validate_data_integrity($data){
		$result=array("success"=>true);		
		$usuario=$this->find("first",array("conditions"=>array("email"=>$data['correo_electronico'],"clave_secreta"=>md5($data['clave_secreta'])),"fields"=>array("Usuario.id","Usuario.nombre","Usuario.estatus","Perfile.id","Perfile.descripcion"/*,"Sucursale.id","Sucursale.descripcion"*/)));	
		if(!empty($usuario)):
			if($usuario['Usuario']['estatus']=="1"):
				$result['id']=$usuario['Usuario']['id'];
				$result['nombre']=$usuario['Usuario']['nombre'];				
				$result['perfil_id']=$usuario['Perfile']['id'];				
				$result['perfil_descripcion']=$usuario['Perfile']['descripcion'];	
/*				
				$result['sucursal_id']=$usuario['Sucursale']['id'];				
				$result['sucursal_descripcion']=$usuario['Sucursale']['descripcion'];				*/
			else:
				$result['msg']=__("El usuario ingresado se encuentra inactivo.",true);	
				$result['success']=false;				
			endif;			
		else:
			$result['success']=false;
			$result['msg']=__("Los datos ingresados no son validos!",true);		
		endif;
		return $result;
	}
	
		
	function validate_sintaxis($data){				
		$result=array("success"=>true);
        if(!eregi("^[^@ ]+@[^@ ]+.[^@ .]+$",$data['correo_electronico'])):
			$result['success']=false;
		endif;        		
        if(!eregi(".{1,10}",$data['clave_secreta'])):
			$result['success']=false;
		endif;    
		if(!$result['success']):
			$result['msg']=__("Los datos ingresados no son validos.",true);	
		endif;
		return $result;
	}	
	
	function validar_recuperar_cuenta($data){		
		$result['success']=false;
		$result['cmdaceptar']=__("Aceptar",true);
		
		if(!eregi("^[^@ ]+@[^@ ]+.[^@ .]+$",$data['correo_electronico'])):
			$result['msg']=__("El correo electronico ingresado no es valido.",true);
		else:
			$usuario=$this->find("first",array("conditions"=>array("email"=>$data['correo_electronico']),"fields"=>array("Usuario.id","Usuario.nombre","Usuario.email","perfil_id","estatus"),"recursive"=>-1));
			if(empty($usuario)):
				$result['msg']=__("La cuenta ingresada no existe.",true);					
			else:
				if($usuario['Usuario']['estatus']=="0"):					
					$result['msg']=__("El usuario ingresado se encuentra inactivo.",true);	
				else:
					##Enviar correo electronico a la direccion ingresada
					if($this->send_mail_recuperar_cuenta($usuario)):
						$result['success']=true;
						$result['msg']=__("Se a enviado un correo electronico a la direccion ingresada.",true);							
					else:
						$result['msg']=__("No se pudo enviar la informaci�n al correo electr�nico ingresado intentelo mas tarde.",true);	
					endif;
				endif;
			endif;
		endif;

		return $result;
	}	
	
	
	
	function listar_registros($data){					
		$conditions=array();	
		if(CakeSession::check("usuario")):
			$usuario=CakeSession::read("usuario");
			$conditions['Usuario.id !=']=$usuario['id'];	
		endif;
			 $segmento_paginado_trabajado=array();					 
			 $order='Usuario.'.$data['campo'].' '.$data['ordenacion'];
			 if($data['cadena']!=""){
				$conditions[$data['campo_busqueda'].' LIKE']=$data['cadena'].'%';
			 }
			 $segmento_paginado=$this->find("all",array("conditions"=>$conditions,"limit"=>$data['number_of_items'],"page"=>$data['page_number'],"order"=>$order,"fields"=>array("Usuario.id","Usuario.nombre","Usuario.email","Usuario.estatus","Perfile.descripcion","Sucursale.descripcion")));						 			 
			 foreach($segmento_paginado as $d):
			 		$b['id']=$d['Usuario']['id'];
		 			$b['nombre']=$d['Usuario']['nombre'];		 				 			
		 			$b['email']=$d['Usuario']['email'];
					$b['sucursale_id']=($d['Sucursale']['descripcion']=="") ? "N/D" : $d['Sucursale']['descripcion'] ;
					$b['estatus']=($d['Usuario']['estatus']=="1") ? "Activo" : "Inactivo";	
					$b['perfil_id']=$d['Perfile']['descripcion'];										
					array_push($segmento_paginado_trabajado,$b);
			 endforeach;
			 array_reverse($segmento_paginado_trabajado);			
			 $result['Filas']=$segmento_paginado_trabajado;		
		     $result['Total']=$this->find('count',array('conditions'=>$conditions));	
			 $result['success']=true;
			 
		return $result;				
	}

	function send_mail_recuperar_cuenta($usuario){
		$email = new CakeEmail('gmail');
		$email->subject("Recuperación de Cuenta");
		$email->template('recuperar_cuenta','control_de_acceso')
			->emailFormat('html')
			->to('jaubgeek@hotmail.com')
			->viewVars(array('usuario' => $usuario));			
		return $email->send();
	}	
						
}
?>