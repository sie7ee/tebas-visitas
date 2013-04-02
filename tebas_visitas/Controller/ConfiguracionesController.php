<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ConfiguracionesController
 *
 * @author GussJQ
 */
class ConfiguracionesController extends AppController {

   public $helpers = array('Html', 'Form', 'Js');
   public $name = 'Configuraciones';
   public $uses = array('Configuracione');
   public $components = array('RequestHandler');

   public function beforeFilter()
   {
      $this->layout = "default_tebas";
      parent::beforeFilter();
   }

   //<editor-fold defaultstate="collapsed" desc="Funciones PROCESO CRUD">
   
//   public function add()
//   {
//      $this->layout = "ajax";
//      $result = array("success" => FALSE, "titulo" => "Atencion!", "msg" => "Ocurrio un error al procesar el formulario.", "cmdaceptar" => __("Aceptar", true));
//
//      if (!empty($this->data))
//      {
//         $hashMapResponse = $this->Sucursal->guardar($this->data);
//         return new CakeResponse(array('body' => json_encode($hashMapResponse)));
//      }
//      
//      $empresas = $this->Sucursal->Empresa->find('list', array(
//                     'fields'=> array('Empresa.razonSocial'), 
//                     'conditions' => array('Empresa.bActivo' => 'true')
//      ));
//      
//      $this->set("empresas", $empresas);
//   }

   /**
    * 
    * @param int $id Identificador de la empresa
    * @return \CakeResponse
    */
   public function edit($id = NULL)
   {
      if (!empty($this->data))
      {
         $this->layout = "ajax";
         $editLogo = TRUE;
         $data = $this->data;
         $hashMapResponse = array('success' => FALSE, ',msg' => 'Ocurrio un error');
         
         if ((!empty($data['Configuracione']['imglogo'])) && ($data['Configuracione']['imglogo']['size'] > 0))
         {
            $upload = $this->_uploadLogo($data['Configuracione']['imglogo']);
            if ($upload['success'])
            {
               $data['Configuracione']['logo'] = $upload['fileName'];
            }
            else
            {
               $editLogo = FALSE;
               $hashMapResponse['msg'] = $upload['error'];
            }
         }
         
         if ($editLogo)
         {
            $hashMapResponse = $this->Configuracione->guardarConfiguracion($this->data);
            if ($hashMapResponse['success'])
            {
               //mover el logo de la carpeta temporal a la carpeta permanente
               $this->_moveIcon($data['Empresa']['logo'], $data['Empresa']['rfc']);
            }
         }

          return new CakeResponse(array('body' => json_encode($hashMapResponse)));
      }
      else
      {
         if ($id != NULL)
         {
            if ($this->Configuracione->exists(array("Configuracion.id" => $id)))
            {
               $this->data = $this->Configuracione->find("first", array("conditions" => array("Configuracion.id" => $id), "recursive" => -1));
            }
         }
      }
      
      $empresas = $this->Configuracione->Empresa->find('list', array(
                     'fields' => array('Empresa.razonSocial'),
                     'conditions' => array('Empresa.activo' => 'true')
          ));
      
      $minutos = array('5' => '5','10' => '10', '15' => '15', '20' => '20', '25' => '25', '30' => '30');
      $horas = array('7' => '7', '8' => '8', '9' => '9', '10' => '10', '11' => '11', '12'=> '12',  '13' => '13', '14' => '14', '15' => '15', '18' => '18', '19' => '19', '20' => '20');
      $duracion = array('1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5');
      $minutosHoras = array('0' => '0', '5' => '5', '10' => '10', '15' => '15', '20' => '20', '25' => '25', '30' => '30', '35' => '35', '40' => '40', '45' => '45', '50' => '50', '55' => '55');
      
      $this->set('empresas', $empresas);
      $this->set('minutos', $minutos);
      $this->set('duracion', $duracion);
      $this->set('horas', $horas);
      $this->set('minutosHoras', $minutosHoras);
      $this->set('caducidad', 30);
   }
   
   private function _uploadLogo($file)
   {
      $request = array('success' => FALSE, 'errors' => '', 'fileName' => '');
      $objFile = new File($file['tmp_name']);
      $documetRoot = $_SERVER['DOCUMENT_ROOT'].= (substr($_SERVER['DOCUMENT_ROOT'], -1) == '/') ? '' : '/';
      $pathParts = pathinfo($file['name']);
      $ext = $pathParts['extension'];

      //validamos extenciones del archivo
      if ($ext != 'jpg' && $ext != 'jpeg' && $ext != 'gif' && $ext != 'png')
      {
         $request['errors'] = 'Extencion no valida.';
      }
      else
      {
         $name = $pathParts['filename'];
         $fileName = time() . '_' . $name . '.' . $ext;

         $data = $objFile->read();
         $objFile->close();

         $objFile = new File($documetRoot . 'app/tmp/configuraciones/' . $fileName, true);
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
         if (@file_exists($documentRoot . 'app/tmp/configuraciones/' . $icon))
         {
            if (!@file_exists($documentRoot . 'webroot/files/'))
            {
               @mkdir($documentRoot . 'webroot/files/', 0777);
            } 
            
            if (!@file_exists($documentRoot . 'webroot/files/configuracion/'))
            {
               @mkdir($documentRoot . 'webroot/files/configuracion/', 0777);
            }

            if (!@file_exists($documentRoot . 'webroot/files/configuracion/' . $rfc . '/'))
            {
               @mkdir($documentRoot . 'webroot/files/configuracion/' . $rfc . '/', 0777);
            } 
            
            if (!@copy($documentRoot . 'app/tmp/configuraciones/' . $icon, $documentRoot . 'files/configuracion/' . $rfc . '/' . $icon))
            {
               $data['errors'][] = 'Imposible mover el logo en la carpeta tmp.';
            } 
            else 
            {
               @unlink($documentRoot . 'app/tmp/configuraciones/' . $icon);
            }
         }
         else   
         {
            $data['errors'][] = 'No se encontro el logo en la carpeta tmp.';
         }
      }

      return $data;
   }

   //</editor-fold>
}

?>
