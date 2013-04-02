<?php

class AplicativosController extends AppController {

   public $helpers = array('Html', 'Form', 'Js');
   public $name = 'Aplicativos';
   public $uses = array('Aplicativo');
   public $components = array('RequestHandler');

   function beforeFilter()
   {
      $this->layout = "default_tebas";
      parent::beforeFilter();
   }

   public function index()
   {
      
   }

   public function listarRegistros()
   {
      $this->layout = "ajax";
      $hashMapResponse = $this->Aplicativo->listarRegistros($this->data);
      return new CakeResponse(array('body' => json_encode($hashMapResponse)));
   }

   public function add()
   {
      $this->layout = "ajax";
      $result = array("success" => FALSE, "titulo" => "Atencion!", "msg" => "Ocurrio un error al procesar el formulario.", "cmdaceptar" => __("Aceptar", true));

      if (!empty($this->data))
      {
         // preguntar a marcos pq no jala 
         $hashMapResponse = $this->Aplicativo->guardar($this->data);
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
   }

   public function edit($id = NULL)
   {
      $this->layout = "ajax";
      if (!empty($this->data))
      {
         $hashMapResponse = $this->Aplicativo->guardar($data);
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($this->Aplicativo->exists(array("Aplicativo.id" => $id)))
         {
            $this->data = $this->Aplicativo->find("first", array("conditions" => array("Aplicativo.id" => $id), "recursive" => -1));
         }
         else
         {
            $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
         }
      }
   }

   public function view($id = NULL)
   {
      $this->layout = "ajax";
      if ($this->Aplicativo->exists(array("Aplicativo.id" => $id)))
      {
         $this->data = $this->Aplicativo->find("first", array("conditions" => array("Aplicativo.id" => $id), "recursive" => -1));
      }
      else
      {
         $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
      }
   }

   public function deleted($id = NULL)
   {
      $this->layout = "ajax";
      if (!empty($this->data))
      {
         $data['Aplicativo']['bActivo'] = FALSE;
         $hashMapResponse = $this->Aplicativo->guardar($data);
         
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($this->Aplicativo->exists(array("Aplicativo.id" => $id)))
         {
            $this->data = $this->Aplicativo->find("first", array("conditions" => array("Aplicativo.id" => $id), "recursive" => -1));
         }
         else
         {
            $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
         }
      }
   }

}

?>