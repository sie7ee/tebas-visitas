<?php

class Departamento extends AppModel {

    // Nombre como se accedera desde el controller
    public $name = 'Departamento';
    // Nombre de la tabla a utilizar
    public $useTable = 'graldepartamentos';
    //relaciones muchos a uno
    public $belongsTo = array(
        'Empresa' => array(
            'className' => 'Empresa',
            'foreignKey' => 'gralEmpresaId'
        ),
        'Sucursal' => array(
            'className' => 'Sucursal',
            'foreignKey' => 'gralSucursalId'
        )
    );
    public $validate = array('nombre' => array(
            'notEmpty' => array(
                'rule' => 'notEmpty',
                'required' => true,
                'message' => 'El nombre no es válido!'
            ))
    );

    public function listarRegistros($params) {
        //inicializa variables
        $hashMapResponse = array();
        $conditions = array('Departamento.activo' => 'true');
        $segmentoPaginadoTrabajado = array();
        $order = $_POST['campo'] . ' ' . $_POST['order'];

        $segmentoPaginado = $this->find("all", array("conditions" => $conditions, "limit" => $_POST['limit'], "page" => $_POST['offset'], "order" => $order, "recursive" => 1, "fields" => array("Departamento.id", "Departamento.nombre", "Departamento.created")));

        if (!empty($segmentoPaginado)) {
            foreach ($segmentoPaginado as $data) {
                array_push($segmentoPaginadoTrabajado, array(
                    'id' => $data['Departamento']['id']
                    , 'titulo' => $data['Departamento']['titulo']
                    , 'created' => $data['Departamento']['created']
                ));
            }

            $hashMapResponse['success'] = true;
            $hashMapResponse['data'] = $segmentoPaginadoTrabajado;
            $hashMapResponse['msg'] = __("Datos recuperados ok.", true);
            $hashMapResponse['total_rows'] = $this->find('count');
            $hashMapResponse['total_rows_search'] = $this->find('count', array('conditions' => $conditions));
        } else {
            $hashMapResponse['success'] = false;
            $hashMapResponse['data'] = array();
            $hashMapResponse['msg'] = __("Ocurrio un error al recuperar los datos!", true);
            $hashMapResponse['total_rows'] = "0";
            $hashMapResponse['total_rows_search'] = "0";
        }

        return $hashMapResponse;
    }
    public function getSucursales($empresaId)
   {
        
      $hashMapResponse=$this->Sucursal->find('list', array(
          'fields'=> array('Sucursal.titulo'),
          'conditions' => array('Sucursal.activo' => 'true','Sucursal.gralEmpresaId'=>$empresaId)
          ));  
          
      return $hashMapResponse;
   }

}

?>
