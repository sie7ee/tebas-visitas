<?php
class UsuariosController extends AppController {
  	var $helpers = array('Html','Form','Js');	
    var $name = 'Usuarios';
	//var $uses = array('Usuario','Perfile',"Aco","Sucursale");	
	var $uses = array('Usuario','Perfile');	
  	var $components = array('RequestHandler');

	function beforeFilter(){
		parent::beforeFilter();		
	}
	
	function logout(){
		$this->Session->delete("user_tebas");	
       	$this->Session->destroy();		
        $this->redirect('login');		
	}
	
	function login(){
		$this->layout="login";
		$this->set("isajax",$this->RequestHandler->isAjax());		
		if(!empty($this->data)):
			$hashmap_response=$this->Usuario->validar_login_form($this->data['Usuario']);	
			if($hashmap_response['success']):
				$this->Session->write("user_tebas",$hashmap_response);
				unset($hashmap_response);
				$hashmap_response['success']=true;							
				return new CakeResponse(array('body'=>json_encode($hashmap_response)));					
				endif;
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));		
		endif;		
	}

	function recuperar_cuenta(){
			$this->layout="login";
			if(!empty($this->data)):					
				$hashmap_response=$this->Usuario->validar_recuperar_cuenta($this->data['Usuario']);
				return new CakeResponse(array('body'=>json_encode($hashmap_response)));	
			endif;			
	}

	function main(){
		if(empty($this->data)):	
		     $conditions=array();
			 $total=$this->Usuario->find('count',array("conditions"=>$conditions));
			 $config_head=array('nombre'=>__('Nombre',true).':250:right','email'=>__('Email',true).':150:right','sucursale_id'=>__('Sucursal',true).':200:right','estatus'=>__('Estatus',true).':60:right','perfil_id'=>__('Perfil',true).':150:right');	
						 	
			 $operaciones=array('add'=>__("Agregar registro",true).":".__("Agregar",true).":ui-icon ui-icon-plus",
							    'edit'=>__("Editar registro",true).":".__("Editar",true).":ui-icon ui-icon-pencil",
							    'view'=>__("Ver registro",true).":".__("Ver",true).":ui-icon ui-icon-search",
							    'delete'=>__("Eliminar registro",true).":".__("Eliminar",true).":ui-icon ui-icon-trash",
								'export'=>__("Exportar",true).":".__("Exportar",true).":ui-icon ui-icon-print");									

			 $this->set('pagina',1);
			 $this->set('filas_por_pagina',20); 
			 $this->set('config_head',$config_head);
			 $this->set('nombre_model',$this->Usuario->name);
			 $this->set('total_filas',$total);
			 $this->set('sentido_ordenamiento','desc');
			 $this->set('campo_ordenamiento', 'id');
			 $this->set('controlador',$this->name);
			 $this->set('accion', 'main');
			 $this->set('operaciones',$operaciones);			 
			 $this->set("filtro",array("Usuario.nombre"=>__("Nombre",true),"Usuario.mail"=>__("Correo Electronico",true),"Perfile.descripcion"=>__("Perfil",true)));	
			 $this->set('titulo_catalago',__('Usuarios',true));				 
		else:
			$this->layout="ajax";			
			$hashmap_response=$this->Usuario->listar_registros($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));			
		endif;			 
	}
	
	function admin(){
	
	}
	
	function add(){
		$this->layout="ajax";
		$result=array("success"=>false,"titulo"=>"Atencion!","msg"=>"Ocurrio un error al procesar el formulario.","cmdaceptar"=>__("Aceptar",true));		
		if(!empty($this->data)):
			$hashmap_response=$this->Usuario->guardar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));
		else:
			$this->set("perfiles",$this->Perfile->find("list",array("order"=>array("descripcion"=>"asc"),"conditions"=>array("Perfile.id !="=>"1"))));
			$this->set("sucursales",$this->Sucursale->find("list",array("order"=>array("Sucursale.descripcion"=>"asc"))));
			$this->set("estatus",array("0"=>"Inactivo","1"=>"Activo"));			
		endif;		
	}	
	
	function edit($id=NULL){
		$this->layout="ajax";
		if(!empty($this->data)):
			$hashmap_response=$this->Usuario->guardar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));
		else:		
			if($this->Usuario->exists(array("Usuario.id"=>$id))):
				$this->data=$this->Usuario->find("first",array("conditions"=>array("Usuario.id"=>$id),"recursive"=>-1));
				$this->set("perfiles",$this->Perfile->find("list",array("order"=>array("descripcion"=>"asc"))));
				$this->set("sucursales",$this->Sucursale->find("list",array("order"=>array("Sucursale.descripcion"=>"asc"))));
				$this->set("estatus",array("0"=>"Inactivo","1"=>"Activo"));				
				$this->set("sucursales",$this->Sucursale->find("list",array("order"=>array("Sucursale.descripcion"=>"asc"))));				
			else:
				$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la peticion."));
			endif;
		endif;
	}


	function view(){
		$this->layout="ajax";	
		$id=(isset($this->data['id']))?$this->data['id']:NULL;		
		if($this->Usuario->exists(array("Usuario.id"=>$id))):
			$this->data=$this->Usuario->find("first",array("conditions"=>array("Usuario.id"=>$id),"recursive"=>-1));	
			$this->set("perfiles",$this->Perfile->find("list",array("order"=>array("descripcion"=>"asc"))));
			$this->set("estatus",array("0"=>"Inactivo","1"=>"Activo"));		
			$this->set("sucursales",$this->Sucursale->find("list",array("order"=>array("Sucursale.descripcion"=>"asc"))));				
		else:
			$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la peticion."));
		endif;	
	}
		
	
	function delete($id=NULL){
		$this->layout="ajax";
		if(!empty($this->data)):
			$hashmap_response=$this->Usuario->eliminar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));			
		else:
			if($this->Usuario->exists(array("Usuario.id"=>$id))):
				$this->data=$this->Usuario->find("first",array("conditions"=>array("Usuario.id"=>$id),"recursive"=>-1));
				$this->set("perfiles",$this->Perfile->find("list",array("order"=>array("descripcion"=>"asc"))));
				$this->set("estatus",array("0"=>"Inactivo","1"=>"Activo"));	
				$this->set("sucursales",$this->Sucursale->find("list",array("order"=>array("Sucursale.descripcion"=>"asc"))));					
			else:
				$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la peticion."));
			endif;			
		endif;
	}
	
	function acceso_denegado(){
			$this->set("isajax",$this->RequestHandler->isAjax());
			if($this->RequestHandler->accepts('json')):
				$hashmap_response=array("success"=>false,"permisos"=>true,"cmdaceptar"=>__("Aceptar",true),"titulo"=>__("Atencion!",true),"msg"=>__("La url solicitada requiere permisos, Pongase en contacto con el administrador del sistema.",true));				
				return new CakeResponse(array('body'=>json_encode($hashmap_response)));	
			endif;			
	}
	
	function editar_cuenta_form(){
		if(!empty($this->data)):			
			$usuario=$this->Usuario->find("first",array("conditions"=>array("Usuario.id"=>$this->data['Usuario']['id']),"recursive"=>-1));
			$usr_update['Usuario']['id']=$usuario['Usuario']['id'];
			$usr_update['Usuario']['nombre']=$this->data['Usuario']['nombre'];
			$usr_update['Usuario']['email']=$usuario['Usuario']['email'];
			$usr_update['Usuario']['clave_secreta']=$this->data['Usuario']['clave_secreta'];
			$usr_update['Usuario']['clave_secreta_repite']=$this->data['Usuario']['clave_secreta_repite'];
			$usr_update['Usuario']['estatus']=$usuario['Usuario']['estatus'];
			$usr_update['Usuario']['perfil_id']=$usuario['Usuario']['perfil_id'];	
			$usr_update['Usuario']['sucursal_id']=($usuario['Usuario']['sucursal_id']!=0) ? $usuario['Usuario']['sucursal_id'] : "0";				
			if($this->Usuario->save($usr_update)):		
				$this->Session->setFlash('<p><strong>Información!, </strong> '.__('El perfil a sido actualizado.',true).'</p>','default',array('class'=>'ui-state-highlight ui-corner-all'));					
			else:
				$this->Session->setFlash('<p><strong>Atención!, El perfil de usuario no puede ser actualizado.</strong></p>','default',array('class'=>'ui-state-error ui-corner-all',"id"=>"msg"));											
			endif;
			$this->data=$usuario;
		else:			
			$usuario=$this->Session->read("usuario");		
			$this->data=$this->Usuario->find("first",array("conditions"=>array("Usuario.id"=>$usuario['id']),"recursive"=>-1,"fields"=>array("Usuario.id","Usuario.nombre","Usuario.email","Usuario.perfil_id")));
			if(empty($this->data)):					
				$this->Session->setFlash('<p><strong>Atención!, El perfil de usuario no a sido encontrado.</strong></p>','default',array('class'=>'ui-state-error ui-corner-all',"id"=>"msg"));		
				$this->redirect(array("controler"=>"usuarios","action"=>"admin"));
			endif;
		endif;
	}
	
	function exportar(){
		$this->set("order",array("ASC"=>"Asc","DESC"=>"Desc"));
		$campos=array("Usuario.nombre"=>__("Nombre(s)",true),"Usuario.email"=>__("Correo Electronico",true),"Usuario.estatus"=>__("Estatus",true),"Usuario.perfil_id"=>__("Perfil",true),"Sucursale.descripcion"=>__("Sucursal",true));	
		$this->set("campos_orden",$campos);			 
		$this->set("campos_condicion",$campos);			 	
		$this->set("tipo_condicion",array("1"=>__("Que comienze con",true),"2"=>__("Que termine con",true),"3"=>__("Que contenga",true),"4"=>__("Que sea igual a",true),
			 			"5"=>__("Que sea diferente de",true)));				
		$this->set("limit",array("50"=>__("Los primeros 50 registros",true),"100"=>__("Los primeros 100 registros",true),'200'=>__('Los primeros 200 registros',true),
									  '500'=>__('Los primeros 500 registros',true)));	
		$this->set('titulo_catalago',__('Acos',true));	
		$this->render('/Elements/exportar');		
		$this->setDebugMode();		
	}

	function reporte(){	
		$this->layout="pdf";
		$limit=NULL;
		$orden=array($this->data['campos_orden']=>$this->data['orden']);	
		if($this->data['limit']!="0"):
			$limit=$this->data['limit'];
		endif;		
        $registros=$this->Usuario->find("all",array("order"=>$orden,"conditions"=>$this->Usuario->get_condition_reporte($this->data),"limit"=>$limit));
		$filas=array();
		foreach($registros as $d):
		    $b=array();			   				
		    $b[]=$d['Usuario']['nombre'];	
			$b[]=$d['Usuario']['email'];	
			$b[]=($d['Sucursale']['descripcion']=="")  ? "N/D" : $d['Sucursale']['descripcion'];	
			$b[]=($d['Usuario']['estatus']=="0") ? "Inactivo" : "Activo";	
			$b[]=$d['Perfile']['descripcion'];	
		 	array_push($filas,$b);
		endforeach;
		array_reverse($filas);
		$this->set("columnas",array(__("Nombre (s)",true),__("Correo Electronico",true),__("Sucursal",true),__("Estatus",true),__("Perfil",true)));
		$this->set("filas",$filas);
		$this->set("logo",'<img  width="40" height="40" src="'.$this->webroot.'app/webroot/img/candado_login.jpg" />');
		parent::setDebugMode();		
		$this->render();
	}
	
}
?>