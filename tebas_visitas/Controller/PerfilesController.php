<?php
class PerfilesController extends AppController {
   public $helpers = array('Html', 'Form', 'Js');
   public $name = 'Perfiles';
   public $uses = array('Perfile');
   public $components = array('RequestHandler');   

   public function beforeFilter(){
      $this->layout = "default_tebas";
      parent::beforeFilter();
   }
   
   /**
    * Metodo vista principal del catalogo
    * @return void
    */
   public function main(){
		if(!empty($this->data)):
		  $this->layout = "ajax";
		  $hashMapResponse = $this->Perfile->listar_registros($this->data);		  
		  return new CakeResponse(array('body' => json_encode($hashMapResponse)));		
		endif;
   }

   /**
    * Metodo que se encarga del proceso de nuevo
    * 
    * @return \CakeResponse
    */
   public function add(){
      $this->layout = "ajax";
      $result=array("success"=>false,"titulo"=>"Atencion!","msg"=>"Ocurrio un error al procesar el formulario.","cmdaceptar"=>__("Aceptar", true));
      if (!empty($this->data)):      	
		$hashMapResponse = $this->Perfile->guardar($this->data);      
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      endif;
   }

   /**
    * 
    * @param int $id Identificador de la Perfile
    * @return \CakeResponse
    */
	function edit($id=NULL){
		$this->layout="ajax";
		if(!empty($this->data)):
			$hashmap_response=$this->Perfile->guardar($this->data);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));
		else:		
			if($this->Perfile->exists(array("Perfile.id"=>$id))):
				$this->data=$this->Perfile->find("first",array("conditions"=>array("Perfile.id"=>$id),"recursive"=>-1));		
			else:
				$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la petición."));
			endif;
		endif;
	}	
   
	function view($id=NULL){
		$this->layout="ajax";		
		if($this->Perfile->exists(array("Perfile.id"=>$id))):
			$this->data=$this->Perfile->find("first",array("conditions"=>array("Perfile.id"=>$id),"recursive"=>-1));		
		else:
			$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la petición."));
		endif;	
	}

	
	function deleted($id){
		$this->layout="ajax";
		if(!empty($this->data)):
			$hashmap_response=$this->Perfile->eliminar($id);
			return new CakeResponse(array('body'=>json_encode($hashmap_response)));			
		else:
			if($this->Perfile->exists(array("Perfile.id"=>$id))):
				$this->data=$this->Perfile->find("first",array("conditions"=>array("Perfile.id"=>$id),"recursive"=>-1));		
			else:
				$this->redirect(array("controler"=>"app","action"=>"error/Ocurrio un error al procesar la petición."));
			endif;			
		endif;
	}
   
   
   //</editor-fold>
   
   private function _uploadLogo($file)
   {
      $request = array('success' => FALSE, 'errors' => array(), 'fileName' => '');
      $objFile = new File($file['tmp_name']);  
      $documetRoot = $_SERVER['DOCUMENT_ROOT'].= (substr($_SERVER['DOCUMENT_ROOT'], -1) == '/') ? '' : '/';
      $pathParts = pathinfo($file['name']);
	 $ext = $pathParts['extension'];
      
      //validamos extenciones del archivo
      if ($ext != 'jpg' && $ext != 'jpeg' && $ext != 'gif' && $ext != 'png')
      {
         $request['errors'][] = 'Extencion no valida.';
      } 
      else 
      {
         $name = $pathParts['filename'];
         $filename = time() . '_' . $name . '.' . $ext;

         $data = $objFile->read();
         $objFile->close();

         $objFile = new File($documetRoot . '/img/' . $filename, true);
         $objFile->write($data);
         $objFile->close();
         
         $request['success'] = TRUE;
         $request['fileName'] = $filename;
      }
      
      return $request;
   }
   
   public function getEstados($paisId)
   {
      $this->layout = "ajax";
      $hashMapResponse = $this->Perfile->getEstados($paisId);
      return new CakeResponse(array('body' => json_encode($hashMapResponse)));
   }
   
   public function getMunicipios($paisId, $estadoId)
   {
      $this->layout = "ajax";
      $hashMapResponse = $this->Perfile->getMunicipios($paisId);
      return new CakeResponse(array('body' => json_encode($hashMapResponse)));
   }

}

?>