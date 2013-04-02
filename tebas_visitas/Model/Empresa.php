<?php

/**
 * Description of Empresa
 *
 * @author GussJQ
 */
class Empresa extends AppModel {

   // Nombre como se accedera desde el controller
   public $name = 'Empresa';
   // Nombre de la tabla a utilizar
   public $useTable = 'gralempresas';
   //relaciones uno a muchos 
   public $hasMany = array(
                  'Sucursal' => array(
                                 'className' => 'Sucursal',
                                 'foreignKey' => 'gralEmpresaId',
                  )
   );
   // validadores de formularios
   public $validate = array(
                  'razonSocial' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'Razon Social no es valido!'
                  )),
                  'rfc' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'Rfc no es valido!'
                  )),
                  'regimenFiscal' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL regime fiscal es requerido.'
                  )),
                  'telefono' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL telefono es requerido.'
                  )),
                  'fax' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL fax es requerido.'
                  )),
                  'email' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL email es requerido.'
                  )),
                  'fax' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL fax es requerido.'
                  )),
                  'url' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'La url es requerido.'
                  )),
                  'logo' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'El logo es requerido.',
                  )),
                  
                  'calle' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'La calle es requerido.'
                  )),
                  'codigoPostal' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL codigo postal es requerido.'
                  )),
                  'numInterior' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL numero interior es requerido.'
                  )),
                  'numExterior' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'EL numero exterior es requerido.'
                  )),
                  'colonia' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'La colonia es requerido.'
                  )),
                  'gralPaisId' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'El Pais es requerido.'
                  )),
                  'gralEstadoId' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'El Estado es requerido.'
                  )),
                  'gralMunicipioId' => array(
                                 'notEmpty' => array(
                                                'rule' => 'notEmpty',
                                                'required' => true,
                                                'message' => 'El Municipio es requerido.'
                  ))
                  
   );

   /**
    * Metodo que se usara para el paginado 
    * @param type $params 
    */
   public function listarRegistros($params)
   {
      $hashMapResponse = array();
      $conditions = array('Empresa.activo' => 'true');
      $segmentoPaginadoTrabajado = array();
      $order = $_POST['campo'] . ' ' . $_POST['order'];

      $segmentoPaginado = $this->find("all", array("conditions" => $conditions, "limit" => $_POST['limit'], "page" => $_POST['offset'], "order" => $order, "recursive" => -1, "fields" => array("Empresa.id", "Empresa.razonSocial", "Empresa.rfc", "Empresa.telefono", "Empresa.created", "Empresa.modified")));

      if (!empty($segmentoPaginado))
      {
         foreach ($segmentoPaginado as $data)
         {
            array_push($segmentoPaginadoTrabajado, array(
                           'id' => $data['Empresa']['id']
                           , 'razonSocial' => $data['Empresa']['razonSocial']
                           , 'telefono' => $data['Empresa']['telefono']
                           , 'rfc' => $data['Empresa']['rfc']
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

   public function getPaises()
   {
      $hashMapResponse = array();
      foreach ($this->query('SELECT id, titulo FROM "gralpaises";') as $value)
      {
         $hashMapResponse[$value[0]['id']] = $value[0]['titulo'];
      }

      return $hashMapResponse;
   }

   public function getEstados($paisId)
   {
      $hashMapResponse = array();
      foreach ($this->query('SELECT id, titulo FROM "gralestados"  where "gralPaisId" = ' . $paisId . ';') as $value)
      {
         $hashMapResponse[$value[0]['id']] = $value[0]['titulo'];
      }

      return $hashMapResponse;
   }

   public function getMunicipios($paisId, $estadoId)
   {
      $hashMapResponse = array();
      foreach ($this->query('SELECT id, titulo FROM "gralmunicipios"  where "gralPaisId" = ' . $paisId . ' AND "gralEstadoId" = ' . $estadoId . ';') as $value)
      {
         $hashMapResponse[$value[0]['id']] = $value[0]['titulo'];
      }

      return $hashMapResponse;
   }

}

?>
