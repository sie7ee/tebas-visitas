<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Empresa
 *
 * @author GussJQ
 */
class Configuracione extends AppModel {

   // Nombre como se accedera desde el controller
//   public $name = 'Configuracione';
   // Nombre de la tabla a utilizar
   public $useTable = 'gralconfiguracion';
   //relacion uno a uno, una empresa tiene una configuracion
   public $hasOne = array(
                  'Empresa' => array(
                                 'className' => 'Empresa',
                                 'foreignKey' => 'gralEmpresaId'
                  )
   );

   public function guardarConfiguracion($data)
   {
      $dataEmpresaSave = array('Empresa');
      $dataConfiguracionesSave = array('Configuracione');
      $empresaId = 1;

      // si no quiere decir que se creara una nueva empresa y al mismo tiempo se dara de alta su configuracion
      $dataEmpresaSave['Empresa']['razonSocial'] = $data['Configuracione']['razonSocial'];
      $dataEmpresaSave['Empresa']['rfc'] = $data['Configuracione']['rfc'];
      $dataEmpresaSave['Empresa']['regimenFiscal'] = $data['Configuracione']['regimenFiscal'];
      $dataEmpresaSave['Empresa']['telefono'] = $data['Configuracione']['telefono'];
      $dataEmpresaSave['Empresa']['fax'] = $data['Configuracione']['fax'];
      $dataEmpresaSave['Empresa']['email'] = $data['Configuracione']['email'];
      $dataEmpresaSave['Empresa']['url'] = $data['Configuracione']['url'];

      if (isset($data['Configuracione']['logo']))
      {
         $dataEmpresaSave['Empresa']['logo'] = $data['Configuracione']['logo'];
      }


      // validams si ya exite una empresa solo se editara la informacion
//      if (isset($data['Configuracione']['empresaId']) && $data['Configuracione']['empresaId'] != '')
//      {
//         $dataEmpresaSave['Empresa']['empresaId'] = $data['Configuracione']['empresaId'];
//         $empresaId = $data['Configuracione']['empresaId'];
//         $this->Empresa->save($dataEmpresaSave);
//      }
//      else
//      {
//         // guardamos los datos de la empresa por primera vez, y recuperamos su id
//         $empresaId = $this->Empresa->save($dataEmpresaSave);
//      }
      // Guardamos la configuracion de la empresa
      //relacion con la empresa
      $dataConfiguracionesSave['Configuracione']['empresaId'] = $empresaId;
      //pestaña 2 horario 
      $dataConfiguracionesSave['Configuracione']['intervalos'] = $data['Configuracione']['intervalos'];
      $dataConfiguracionesSave['Configuracione']['horaInicioVisita'] = $data['Configuracione']['horaInicioVisita'] . ':' . $data['Configuracione']['minutosInicioVisitas'];
      $dataConfiguracionesSave['Configuracione']['horaFinVisita'] = $data['Configuracione']['horaFinVisita'] . ':' . $data['Configuracione']['minutosFinVisitas'];
      $dataConfiguracionesSave['Configuracione']['duracionMaxima'] = $data['Configuracione']['duracionMaxima'];
      //pestaña 3 entrada a visita
      $dataConfiguracionesSave['Configuracione']['retardoPermitido'] = $data['Configuracione']['horaInicioVisita'];
      $dataConfiguracionesSave['Configuracione']['duracionMinima'] = $data['Configuracione']['duracionMinima'];
      // pestaña 4 seguridad
      $dataConfiguracionesSave['Configuracione']['geneCuentasUsuario'] = $data['Configuracione']['geneCuentasUsuario'];
      $dataConfiguracionesSave['Configuracione']['cambioContrasena'] = $data['Configuracione']['cambioContrasena'];
      $dataConfiguracionesSave['Configuracione']['diasCaducidad'] = $data['Configuracione']['diasCaducidad'];
      $dataConfiguracionesSave['Configuracione']['formaAutenticacion'] = $data['Configuracione']['formaAutenticacion'];

      $this->save($dataConfiguracionesSave);
   }

}

?>
