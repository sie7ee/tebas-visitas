<?php

class SucursalesController extends AppController {

   public $helpers = array('Html', 'Form', 'Js');
   public $name = 'Sucursales';
   public $uses = array('Sucursal');
   public $components = array('RequestHandler');

   function beforeFilter()
   {
      $this->layout = "default_tebas";
      parent::beforeFilter();
   }

   public function main()
   {
      
   }

   public function listarRegistros()
   {
      $this->layout = "ajax";
      $hashMapResponse = $this->Sucursal->listarRegistros($this->data);
      return new CakeResponse(array('body' => json_encode($hashMapResponse)));
   }

   public function add()
   {
      $this->layout = "ajax";
      $hashMapResponse = array("success" => FALSE, "titulo" => "Atencion!", "msg" => "Ocurrio un error al procesar el formulario.", "cmdaceptar" => __("Aceptar", true));

      if (!empty($this->data))
      {
         // preguntar a marcos pq no jala 
         $data = array('Sucursal');
         $data['Sucursal']['titulo'] = $this->data['Sucursales']['titulo'];
         $data['Sucursal']['gralEmpresaId'] = $this->data['Sucursales']['gralEmpresaId'];
         $hashMapResponse = $this->Sucursal->guardar($data);
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      
      $empresas = $this->Sucursal->Empresa->find('list', array(
                     'fields'=> array('Empresa.razonSocial'), 
                     'conditions' => array('Empresa.activo' => 'true')
      ));
      
      $this->set("empresas", $empresas);
   }

   public function edit($id = NULL)
   {
      $this->layout = "ajax";
      if (!empty($this->data))
      {
         $data = array('Sucursal');
         $data['Sucursal']['id'] = $this->data['Sucursales']['id'];
         $data['Sucursal']['titulo'] = $this->data['Sucursales']['titulo'];
         $data['Sucursal']['gralEmpresaId'] = $this->data['Sucursales']['gralEmpresaId'];
         $hashMapResponse = $this->Sucursal->guardar($data);
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($this->Sucursal->exists(array("Sucursal.id" => $id)))
         {
            $data = $this->Sucursal->find("first", array("conditions" => array("Sucursal.id" => $id), "recursive" => -1));
            $arr = array('Sucursales');
            $arr['Sucursales']['id'] = $id;
            $arr['Sucursales']['titulo'] = $data['Sucursal']['titulo'];
            $arr['Sucursales']['gralEmpresaId'] = $data['Sucursal']['gralEmpresaId'];
            $this->data = $arr;
         }
         else
         {
            $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
         }
      }
      
      $empresas = $this->Sucursal->Empresa->find('list', array(
                     'fields' => array('Empresa.razonSocial'),
                     'conditions' => array('Empresa.activo' => 'true')
          ));

      $this->set("empresas", $empresas);
   }

   public function view($id = NULL)
   {
      $this->layout = "ajax";

      if ($this->Sucursal->exists(array("Sucursal.id" => $id)))
      {
         $data = $this->Sucursal->find("first", array("conditions" => array("Sucursal.id" => $id), "recursive" => -1));
         $arr = array('Sucursales');
         $arr['Sucursales']['id'] = $data['Sucursal']['id'];
         $arr['Sucursales']['titulo'] = $data['Sucursal']['titulo'];
         $arr['Sucursales']['gralEmpresaId'] = $data['Sucursal']['gralEmpresaId'];
         $this->data = $arr;
      }
      else
      {
         $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
      }
      
      $empresas = $this->Sucursal->Empresa->find('list', array(
                     'fields' => array('Empresa.razonSocial'),
                     'conditions' => array('Empresa.activo' => 'true')
          ));

      $this->set("empresas", $empresas);
   }

   public function deleted($id = NULL)
   {
      $this->layout = "ajax";
      if (!empty($this->data))
      {
         $data['Sucursal']['id'] = $this->data['Sucursales']['id']; 
         $data['Sucursal']['bActivo'] = 'FALSE';
         $hashMapResponse = $this->Sucursal->guardar($data);
         
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($this->Sucursal->exists(array("Sucursal.id" => $id)))
         {
            $data = $this->Sucursal->find("first", array("conditions" => array("Sucursal.id" => $id), "recursive" => -1));
            $arr = array('Sucursales');
            $arr['Sucursales']['id'] = $id;
            $arr['Sucursales']['titulo'] = $data['Sucursal']['titulo'];
            $arr['Sucursales']['gralEmpresaId'] = $data['Sucursal']['gralEmpresaId'];
            $this->data = $arr;
         }
         else
         {
            $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
         }
         
         $empresas = $this->Sucursal->Empresa->find('list', array(
                     'fields' => array('Empresa.razonSocial'),
                     'conditions' => array('Empresa.activo' => 'true')
          ));
         
         $this->set("empresas", $empresas);
      }
   }

}

?>