<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of EmpresasController
 *
 * @author GussJQ
 */
class EmpresasController extends AppController {

   public $helpers = array('Html', 'Form', 'Js');
   public $name = 'Empresas';
   public $uses = array('Empresa');
   public $components = array('RequestHandler');

   public function beforeFilter()
   {
      $this->layout = "default_tebas";
      parent::beforeFilter();
   }

   //<editor-fold defaultstate="collapsed" desc="Funciones PROCESO CRUD">

   /**
    * Metodo vista principal del catalogo
    * @return void
    */
   public function main()
   {
      
   }

   /**
    * Metodo que se encarga del proceso de nuevo
    * 
    * @return \CakeResponse
    */
   public function add()
   {
      $this->layout = "ajax";
      $hashMapResponse = array("success" => FALSE, "titulo" => "Atencion!", "msg" => "Ocurrio un error al procesar el formulario.", "cmdaceptar" => __("Aceptar", true));

      if (!empty($this->data))
      {
         $data = $this->data;
         if ((!empty($data['Empresa']['imglogo'])) && ($data['Empresa']['imglogo']['size'] > 0))
         {
            $upload = $this->_uploadLogo($this->data['Empresa']['imglogo']);
            $data['Empresa']['logo'] = $upload['fileName'];
         }

         $hashMapResponse = $this->Empresa->guardar($data);

         if ($hashMapResponse['success'] && isset($upload['success']) && $upload['success'])
         {
            //mover el logo de la carpeta temporal a la carpeta permanente
            $this->_moveIcon($data['Empresa']['logo'], $data['Empresa']['rfc']);
         }

         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }

      $this->set('paises', $this->Empresa->getPaises());
   }

   /**
    * 
    * @param int $id Identificador de la empresa
    * @return \CakeResponse
    */
   public function edit($id = NULL)
   {
      $this->layout = "ajax";
      $hashMapResponse = array("success" => FALSE, "titulo" => "Atencion!", "msg" => "Ocurrio un error al procesar el formulario.", "cmdaceptar" => __("Aceptar", true));
      
      if (!empty($this->data))
      {
         $editLogo = FALSE;
         $data = $this->data;
         
         if (!empty($data['Empresa']['imglogo']))
         {
            $editLogo = TRUE;
            $upload = $this->_uploadLogo($data['Empresa']['imglogo']);
            if ($upload['success'])
            {
               $data['Empresa']['logo'] = $upload['fileName'];
            }
            else
            {
               $editLogo = FALSE;
            }
         }
         
         $hashMapResponse = $this->Empresa->guardar($data);
         
         if ($hashMapResponse['success'] && $editLogo)
         {
            //mover el logo de la carpeta temporal a la carpeta permanente
            $this->_moveIcon($data['Empresa']['logo'], $data['Empresa']['rfc']);
         }

         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($this->Empresa->exists(array("Empresa.id" => $id)))
         {
            $this->data = $this->Empresa->find("first", array("conditions" => array("Empresa.id" => $id), "recursive" => -1));
            $this->set('paises', $this->Empresa->getPaises());
            $this->set('estados', $this->getEstados($this->data['Empresa']['gralPaisId'], FALSE));
            $this->set('municipios', $this->getMunicipios($this->data['Empresa']['gralPaisId'], $this->data['Empresa']['gralEstadoId'], FALSE));
         }
         else
         {
            $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
         }
      }

      $this->set('paises', $this->Empresa->getPaises());
   }

   public function view($id = NULL)
   {
      $this->layout = "ajax";

      if ($this->Empresa->exists(array("Empresa.id" => $id)))
      {
         $this->data = $this->Empresa->find("first", array("conditions" => array("Empresa.id" => $id), "recursive" => -1));
         $this->set('paises', $this->Empresa->getPaises());
         $this->set('estados', $this->getEstados($this->data['Empresa']['gralPaisId'], FALSE));
         $this->set('municipios', $this->getMunicipios($this->data['Empresa']['gralPaisId'], $this->data['Empresa']['gralEstadoId'], FALSE));
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
         $arr = array();
         $arr['Empresa']['id'] = $this->data['Empresa']['id'];
         $arr['Empresa']['bActivo'] = 'FALSE';
         
         $hashMapResponse = $this->Empresa->guardar($arr);
         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($this->Empresa->exists(array("Empresa.id" => $id)))
         {
            $this->data = $this->Empresa->find("first", array("conditions" => array("Empresa.id" => $id), "recursive" => -1));
            
            $this->set('paises', $this->Empresa->getPaises());
            $this->set('estados', $this->getEstados($this->data['Empresa']['gralPaisId'], FALSE));
            $this->set('municipios', $this->getMunicipios($this->data['Empresa']['gralPaisId'], $this->data['Empresa']['gralEstadoId'], FALSE));
         }
         else
         {
            $this->redirect(array("controler" => "app", "action" => "error/Ocurrio un error al procesar la peticion."));
         }
      }
   }

   //</editor-fold>
   
   //<editor-fold defaultstate="collapsed" desc="Funciones PROCESO GRID">

   public function listarRegistros()
   {
      $this->layout = "ajax";
      $hashMapResponse = $this->Empresa->listarRegistros($this->data);

      return new CakeResponse(array('body' => json_encode($hashMapResponse)));
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
         $fileName = time() . '_' . $name . '.' . $ext;

         $data = $objFile->read();
         $objFile->close();

         $objFile = new File($documetRoot . 'app/tmp/empresas/' . $fileName, true);
         $objFile->write($data);
         $objFile->close();

         $request['success'] = TRUE;
         $request['fileName'] = $fileName;
      }

      return $request;
   }
   
   private function _moveIcon($icon = '', $rfc = ''){
      
      $icon = (string) $icon;

      // por default se coloca success en true por que los datos si fueron guardados en la BD
      $data = array('success' => TRUE, 'errors' => array());

      // recuperamos el directorio raiz del proyecto 
      $documentRoot = $_SERVER['DOCUMENT_ROOT'].= (substr($_SERVER['DOCUMENT_ROOT'], -1) == '/') ? '' : '/';
      if ($icon != '' && $rfc != '')
      {
         if (@file_exists($documentRoot . 'app/tmp/empresas/' . $icon))
         {
            if (!@file_exists($documentRoot . 'app/webroot/img/'))
            {
               @mkdir($documentRoot . 'app/webroot/img/', 0777);
            } 
            
            if (!@file_exists($documentRoot . 'app/webroot/img/empresas/'))
            {
               @mkdir($documentRoot . 'app/webroot/img/empresas/', 0777);
            }

            if (!@file_exists($documentRoot . 'app/webroot/img/empresas/' . $rfc . '/'))
            {
               @mkdir($documentRoot . 'app/webroot/img/empresas/' . $rfc . '/', 0777);
            } 
            
            if (!@copy($documentRoot . 'app/tmp/empresas/' . $icon, $documentRoot . 'app/webroot/img/empresas/' . $rfc . '/' . $icon))
            {
               $data['errors'][] = 'Imposible mover el logo en la carpeta tmp.';
            } 
            else 
            {
               @unlink($documentRoot . 'app/tmp/empresas/' . $icon);
            }
         }
         else   
         {
            $data['errors'][] = 'No se encontro el logo en la carpeta tmp.';
         }
      }

      return $data;
   }

   public function getEstados($paisId, $isAjax = true)
   {
      $hashMapResponse = $this->Empresa->getEstados($paisId);
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

   public function getMunicipios($paisId, $estadoId, $isAjax = true)
   {
      $hashMapResponse = $this->Empresa->getMunicipios($paisId, $estadoId);
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
