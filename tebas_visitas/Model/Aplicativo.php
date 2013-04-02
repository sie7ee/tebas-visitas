<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Aplicativo
 *
 * @author GussJQ
 */
class Aplicativo extends AppModel {
   
   // Nombre como se accedera desde el controller
   public $name = 'Aplicativo';
   // Nombre de la tabla a utilizar
   public $useTable = 'admAplicativos';
   
   
   /**
    * Metodo que se usara para el paginado 
    * @param type $params 
    */
   public function listarRegistros($params)
   {
      $hashMapResponse = array();
      $conditions = array();
      $segmentoPaginadoTrabajado = array();
      $order = $_POST['campo'] . ' ' . $_POST['order'];

      $segmentoPaginado = $this->find("all", array("conditions" => $conditions, "limit" => $_POST['limit'], "page" => $_POST['offset'], "order" => $order, "recursive" => 1, "fields" => array("Aplicativo.id", "Aplicativo.titulo", "Aplicativo.created", "Empresa.razonSocial")));

      if (!empty($segmentoPaginado))
      {
         foreach ($segmentoPaginado as $data)
         {
            array_push($segmentoPaginadoTrabajado, array(
                           'id' => $data['Aplicativo']['id']
                           , 'titulo' => $data['Aplicativo']['titulo']
                           , 'razonSocial' => $data['Empresa']['razonSocial']
                           , 'created' => $data['Aplicativo']['created']
            ));
         }

         $hashMapResponse['success'] = true;
         $hashMapResponse['data'] = $segmentoPaginadoTrabajado;
         $hashMapResponse['msg'] = __("Datos recuperados ok.", true);
         $hashMapResponse['total_rows'] = $this->find('count');
         $hashMapResponse['total_rows_search'] = $this->find('count', array('conditions' => $conditions));
      }
      else
      {
         $hashMapResponse['success'] = false;
         $hashMapResponse['data'] = array();
         $hashMapResponse['msg'] = __("Ocurrio un error al recuperar los datos!", true);
         $hashMapResponse['total_rows'] = "0";
         $hashMapResponse['total_rows_search'] = "0";
      }

      return $hashMapResponse;
   }
}

?>
