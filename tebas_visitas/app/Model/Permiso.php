<?php
class Permiso extends AppModel{
	var $name = 'Permiso';
	var $belongsTo=array('Perfile'=>array('className' =>'Perfile','foreignKey'=>'perfil_id'),
						 'Aco'=>array('className' =>'Aco','foreignKey'=>'aco_id'));
						 
	var $validate=array('aco_id'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'La accion ingresada no es valida!'
									),						
								'isUniqueCustom'=>array(
									'rule'=>'isUniquePermiso',
									'allowEmpty'=>true,
									'message'=>'El permiso para este aco ya existe!'
									)
									),
						'estatus'=>array(
								'numeric'=>array(
									'rule'=>'numeric',
									'required'=>true,
									'message'=>'El estatus ingresado no es valido!'
									)),
						'perfil_id'=>array(
								'numeric'=>array(
									'rule'=>'numeric',
									'required'=>true,
									'message'=>'El perfil ingresado no es valido!'
									))
						);
    function isUniquePermiso(){	
		$result=true;
		$permiso_id=$this->field("id",array("Permiso.aco_id"=>$this->data[$this->alias]['aco_id'],"Permiso.perfil_id"=>$this->data[$this->alias]['perfil_id']));
		if($permiso_id!=NULL):
			if(isset($this->data[$this->alias]['id'])):
				if($permiso_id!=$this->data[$this->alias]['id']):
					$result=false;
				endif;
			else:
				$result=false;
			endif;
		endif;
        return $result;
    }	
	
	function __tiene_acceso($perfil_id,$aco_id){
		$success=false;
		$permiso=$this->find("first",array("conditions"=>array("perfil_id"=>$perfil_id,"aco_id"=>$aco_id),"recursive"=>-1,"fields"=>array("id","perfil_id","aco_id","estatus")));
		if(!empty($permiso)):
			if($permiso['Permiso']['estatus']=="1"):
				$success=true;
			endif;		
		endif;
		return $success;
	}
	
	function listar_registros($data){
			 $conditions=array();	
			 $segmento_paginado_trabajado=array();					 
			 $order='Permiso.'.$data['campo'].' '.$data['ordenacion'];			 
			 if($data['select1']!=""){
				$conditions['Aco.controlador']=$data['select1'];
			 }
			 if($data['select2']!="0"){
				$conditions["Permiso.perfil_id"]=$data['select2'];
			 }			 
			 
			$segmento_paginado=$this->find("all",array("conditions"=>$conditions,"limit"=>$data['number_of_items'],"page"=>$data['page_number'],"order"=>$order,"fields"=>array("Permiso.id","Permiso.estatus","Permiso.created","Permiso.modified","Aco.id","Aco.controlador","Aco.accion","Perfile.id","Perfile.descripcion")));					
			 foreach($segmento_paginado as $d):			 
			 		$b['id']=$d['Permiso']['id'];
		 			$b['perfil_id']=$d['Perfile']['descripcion'];
		 			$b['aco_id']="<strong>".strtoupper($d['Aco']['controlador'])."</strong> -> ".$d['Aco']['accion'];					
		 			$b['estatus']=($d['Permiso']['estatus']=="1") ? "<a href='#' id='a_permiso' title='{$d['Permiso']['id']}'><span class='ui-icon ui-icon-check'></span></a>" :  "<a href='#' id='a_permiso' title='{$d['Permiso']['id']}'><span class='ui-icon ui-icon-closethick'></span></a>" ;
					array_push($segmento_paginado_trabajado,$b);
			 endforeach;	
			
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