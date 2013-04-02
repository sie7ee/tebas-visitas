<?php
class AcosController extends AppController {
  	var $helpers = array('Html','Form','Js');	
    var $name = 'Acos';
	var $uses = array('Aco','Perfile');	
  	var $components = array('RequestHandler');
	
	function beforeFilter(){
		parent::beforeFilter();
	}	
	
	function main(){
		if(empty($this->data)):	

		else:/*
			$this->layout="ajax";
			$hashmap_response=$this->Aco->listar_registros($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));*/			
		endif;			
	}	
	
	function add(){
		$this->layout="ajax";
		$result=array("success"=>false,"titulo"=>"Atencion!","msg"=>"Ocurrio un error al procesar el formulario.","cmdaceptar"=>__("Aceptar",true));
		if(!empty($this->data)):
			$hashmap_response=$this->Aco->guardar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));
		endif;		
	}

	function edit($id=NULL){
		$this->layout="ajax";
		if(!empty($this->data)):
			$hashmap_response=$this->Aco->guardar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));
		else:		
			if($this->Aco->exists(array("Aco.id"=>$id))):
				$this->data=$this->Aco->find("first",array("conditions"=>array("Aco.id"=>$id),"recursive"=>-1));		
			else:
				$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la peticion."));
			endif;
		endif;
	}	
	
	function view(){
		$this->layout="ajax";	
		$id=(isset($this->data['id']))?$this->data['id']:NULL;		
		if($this->Aco->exists(array("Aco.id"=>$id))):
			$this->data=$this->Aco->find("first",array("conditions"=>array("Aco.id"=>$id),"recursive"=>-1));		
		else:
			$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la peticion."));
		endif;	
	}
	
	function delete($id=NULL){
		$this->layout="ajax";
		if(!empty($this->data)):
			$hashmap_response=$this->Aco->eliminar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));			
		else:
			if($this->Aco->exists(array("Aco.id"=>$id))):
				$this->data=$this->Aco->find("first",array("conditions"=>array("Aco.id"=>$id),"recursive"=>-1));		
			else:
				$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la peticion."));
			endif;			
		endif;
	}	

	
		
}
?>