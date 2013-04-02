<?php
class Perfile extends AppModel{
	var $name = 'Perfile';
	var $displayField = 'descripcion';
     var $useTble = 'admPerfiles';
	
	/*
	var $hasMany=array('Usuario'=>array('className'=>'Usuario','foreignKey'=>'perfil_id'),
					   'Permiso'=>array('className'=>'Permiso','foreignKey'=>'perfil_id')); */
	
	var $validate=array('descripcion'=>array(
								'notEmpty'=>array(
									'rule'=>'notEmpty',
									'required'=>true,
									'message'=>'La descripcion ingresada no es valida!'
									),
								'isUnique'=>array(
									'rule'=>"isUnique",
									'message'=>'La descripcion ingresada ya existe!'
								)
								));
								
	function listar_registros($data){
			$hashmap_response=array("success"=>false);
			$conditions=array("1"=>"1");	
			$segmento_paginado_trabajado=array();					 
			$order=$_POST['campo'].' '.$_POST['order'];			 
			 /*
			 if($data['cadena']!=""){
				$conditions[$data['campo_busqueda'].' LIKE']=$data['cadena'].'%';
			 }*/
			 
			try{
				$segmento_paginado=$this->find("all",array("conditions"=>$conditions,"limit"=>$_POST['limit'],"page"=>$_POST['offset'],"order"=>$order,"recursive"=>-1,"fields"=>array("Perfile.id","Perfile.descripcion","Perfile.created","Perfile.modified")));					
				foreach($segmento_paginado as $d):
							$b['id']=$d['Perfile']['id'];
							$b['descripcion']=$d['Perfile']['descripcion'];
							$b['created']=$d['Perfile']['created'];					
							$b['modified']=$d['Perfile']['modified'];					
							array_push($segmento_paginado_trabajado,$b);
				endforeach;							
				$hashmap_response['success']=true;
				$hashmap_response['data']=$segmento_paginado_trabajado;
				$hashmap_response['msg']=__("Datos recuperados ok.",true);
				$hashmap_response['total_rows']=$this->find('count');			
				$hashmap_response['total_rows_search']=$this->find('count',array('conditions'=>$conditions));				
			}catch(Exception $e){
				$hashmap_response['success']=false;
				$hashmap_response['data']=array();
				$hashmap_response['msg']=$e->getMessage();				
				$hashmap_response['total_rows']="0";
				$hashmap_response['total_rows_search']="0";				
			}
		return $hashmap_response;				
	}									
 
}
?>