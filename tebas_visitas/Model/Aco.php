<?php
class Aco extends AppModel{
	var $name = 'Aco';
	var $hasMany=array('Permiso'=>array('className'=>'Permiso','foreignKey'=>'aco_id')); 	
	var $validate=array('controlador'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'El controlador ingresado no es valido!'
									)),
						'accion'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'La accion ingresada no es valida!'
									),						
									'isUniqueCustom'=>array(
												'rule'=>'isUniqueAco',
												'allowEmpty'=>true,
												'message'=>'El objeto de control de acceso ya existe!'
												)
									),
						'control_acceso'=>array(
								'numeric'=>array(
									'rule'=>'numeric',
									'required'=>true,
									'message'=>'El control de acceso ingresado no es valido!'
									))
						);	
						
    function isUniqueAco(){	
		$result=true;
		$aco_id=$this->field("id",array("Aco.controlador"=>$this->data[$this->alias]['controlador'],"Aco.accion"=>$this->data[$this->alias]['accion']));
		if($aco_id!=NULL):
			if(isset($this->data[$this->alias]['id'])):
				if($aco_id!=$this->data[$this->alias]['id']):
					$result=false;
				endif;
			else:
				$result=false;
			endif;
		endif;
        return $result;
    }	
	
	
	function __permitir_accion($controlador,$accion,$control_acceso){
		$success=true;
		$aco=$this->find("first",array("conditions"=>array("controlador"=>$controlador,"accion"=>$accion,"control_acceso"=>$control_acceso),"recursive"=>-1));
		if(!empty($aco)):
			$success=false;
		endif;
		return $success;
	}	

	function get_aco_id($controlador,$accion){
		return $this->field("id",array("controlador"=>$controlador,"accion"=>$accion));
	}
	
	
	function getAcosList(){
		$acos_aux=$this->query("SELECT controlador FROM acos GROUP BY(controlador) ORDER BY controlador ASC");				
		$acos=array(""=>" -- Todos -- ");
		foreach($acos_aux as $aco):
			$acos[$aco['acos']['controlador']]=strtoupper($aco['acos']['controlador']);
		endforeach;	
		return $acos;
	}	
	
	function getActionsList(){
		$acos_aux=$this->find("all",array("order"=>array("Aco.controlador"=>"asc","Aco.accion"=>"asc"),"fields"=>array("Aco.id","Aco.controlador","Aco.accion"),"recursive"=>-1));
		$acos=array();
		foreach($acos_aux as $aco):
			$acos[$aco['Aco']['id']]=strtoupper($aco['Aco']['controlador'])." - ".$aco['Aco']['accion'];
		endforeach;	
		return $acos;
	}	
	
	
	function listar_registros($data){
			 $conditions=array();	
			 $segmento_paginado_trabajado=array();					 
			 $order='Aco.'.$data['campo'].' '.$data['ordenacion'];
			 if($data['cadena']!=""){
				$conditions[$data['campo_busqueda'].' LIKE']=$data['cadena'].'%';
			 }
			$segmento_paginado=$this->find("all",array("conditions"=>$conditions,"limit"=>$data['number_of_items'],"page"=>$data['page_number'],"order"=>$order,"recursive"=>-1,"fields"=>array("Aco.id","Aco.controlador","Aco.accion","Aco.control_acceso")));					
			 foreach($segmento_paginado as $d):
			 		$b['id']=$d['Aco']['id'];
		 			$b['controlador']=strtoupper($d['Aco']['controlador']);
					$b['accion']=$d['Aco']['accion'];
					$b['control_acceso']=($d['Aco']['control_acceso']=="1") ? "Si" :  "No";					
					array_push($segmento_paginado_trabajado,$b);
			 endforeach;
			 array_reverse($segmento_paginado_trabajado);			
			 $result['Filas']=$segmento_paginado_trabajado;		
		     $result['Total']=$this->find('count',array('conditions'=>$conditions));	
			 $result['success']=true;
		return 	$result;		
	}	
	
	function afterSave(){
		$this->query("CALL setup_permisos();");
	}
	
	
}
?>