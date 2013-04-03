<?php

class DepartamentosController extends AppController {

    public $helpers = array('Html', 'Form', 'Js');
    public $name = 'Departamentos';
    public $uses = array('Departamento');
    public $components = array('RequestHandler');

    function beforeFilter() {
        $this->layout = "default_tebas";
        parent::beforeFilter();
    }

    public function main() {
        
    }

    public function listarRegistros() {
        $this->layout = "ajax";
        $hashMapResponse = $this->Departamento->listarRegistros($this->data);
        return new CakeResponse(array('body' => json_encode($hashMapResponse)));
    }

    public function add() {
        $this->layout = "ajax";
        $hashMapResponse = array("success" => FALSE, "titulo" => "Atencion!", "msg" => "Ocurrio un error al procesar el formulario.", "cmdaceptar" => __("Aceptar", true));

        if (!empty($this->data)) {

            $data = array('Departamento');
            $data['Departamento']['nombre'] = $this->data['Depatamentos']['nombre'];

            $hashMapResponse = $this->Departamento->guardar($data);
            return new CakeResponse(array('body' => json_encode($hashMapResponse)));
        }

        $empresas = $this->Departamento->Empresa->find('list', array(
          'fields'=> array('Empresa.razonSocial'),
          'conditions' => array('Empresa.activo' => 'true')
          ));
          
        $this->set("empresas", $empresas);
    }
    
    public function getSucursales($empresaId=0, $isAjax = true)
   {
      $hashMapResponse = $this->Departamento->getSucursales($empresaId);
      if ($isAjax)
      {
         $this->layout = "ajax";
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         return $hashMapResponse;
      }
   }

}

?>
