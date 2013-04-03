<h3 class="ui-widget-header"><?php echo __("Editar Configuracion",true); ?></h3>
<div id="tabs">

   <ul>
      <li><a href="#tabs-1">Empresa</a></li>
      <li><a href="#tabs-2">Horario</a></li>
      <li><a href="#tabs-3">Entrada a Visita</a></li>
      <li><a href="#tabs-4">Seguridad</a></li>
   </ul>
   
   <?php echo $this->Form->create("Configuracione", array('action' => 'edit', 'type' => 'file', 'id' => 'Form00', 'class' => 'form-horizontal')); ?>
   <?php echo $this->Form->hidden('id', array('id' => 'id')); ?>
   
   <div id="tabs-1">
      <fieldset>
         <legend>Datos Generales</legend>
         <div class="row-fluid">
               
                <div class="control-group">
                  <label class="control-label" for="empresaId"><?php echo __("Empresa *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->select('empresaId', $empresas, array('class' => 'input-large')); ?>
                    <span id="sp_error" style="display:none;" name="empresaId" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="razonSocial"><?php echo __("Razon Social *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('razonSocial', array('label' => FALSE, 'maxlength' => '50', 'id' => 'razonSocial', 'class' => 'input-xxlarge')); ?>
                     <span id="sp_error" style="display:none;" name="razonSocial" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="rfc"><?php echo __("Rfc *", true); ?> &nbsp;&nbsp;</label>
                  <div class="controls">
                     <?php echo $this->Form->input('rfc', array('label' => FALSE, 'maxlength' => '50', 'id' => 'rfc', 'class' => 'input-xxlarge')); ?>
                     <span id="sp_error" style="display:none;" name="rfc" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="regimenFiscal"><?php echo __("Reg. Fiscal *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('regimenFiscal', array('label' => FALSE, 'maxlength' => '50', 'id' => 'regimenFiscal', 'class' => 'input-xxlarge')); ?>
                     <span id="sp_error" style="display:none;" name="regimenFiscal" class="label label-important"></span>
                  </div>
               </div>

         </div>

         <div class="row-fluid">

            <div class="span4">

               <div class="control-group">
                  <label class="control-label" for="telefono"><?php echo __("Telefono *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('telefono', array('label' => FALSE, 'maxlength' => '50', 'id' => 'telefono', 'class' => 'input-large')); ?>
                     <span id="sp_error" style="display:none;" name="telefono" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="fax"><?php echo __("Fax *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('fax', array('label' => FALSE, 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                     <span id="sp_error" style="display:none;" name="fax" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="email"><?php echo __("Email *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('email', array('label' => FALSE, 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                     <span id="sp_error" style="display:none;" name="email" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="url"><?php echo __("Url *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('url', array('label' => FALSE, 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                     <span id="sp_error" style="display:none;" name="url" class="label label-important"></span>
                  </div>
               </div>

               <div class="control-group">
                  <label class="control-label" for="logo"><?php echo __("Logo *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->input('imglogo', array('label' => FALSE, 'type' => 'file', 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                     <span id="sp_error" style="display:none;" name="logo" class="label label-important"></span>
                  </div>
               </div>

            </div>

            <div class="span1"></div>

            <div class="span3">
               <?php echo $this->Html->image('logo.jpg'); ?>
            </div>

         </div>
      </fieldset>
   </div>
   <!-- Fin perimer tab -->

   <!--  inicia segunda tab Horario -->
   <div id="tabs-2">

      <fieldset>
         <legend>Horario Cita</legend>
         <div class="row-fluid">
            Intervalo de tiempo: Minutos que el sistema necesita para tomarlos como rangos de tiempo,
            los cuales necesitaran para armar el control de horario de usuario,
            dependiendo de estos tiempos es como quedara el calendario.
         </div>

         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="intervalos"><?php echo __("Interv. de tiempo *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('intervalos', $minutos, array('class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="intervalos" class="label label-important"></span>
               </div>
            </div>
         </div>

         <div class="row-fluid">
            Hora de inicio: Es la hora del día más temprana en las que los usuarios podrán realizar citas.
         </div>

         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="horaInicioVisita"><?php echo __("Hora Inicio *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('horaInicioVisita', $horas, array('class' => 'input-large')); ?>&nbsp;Horas&nbsp;<?php echo $this->Form->select('minutosInicioVisitas', $minutosHoras, array('class' => 'input-large')); ?>&nbsp;Minutos
                  <span id="sp_error" style="display:none;" name="horaInicioVisita" class="label label-important"></span>
               </div>
            </div>
         </div>

         <div class="row-fluid">
            Hora Fin: Es la hora limite del dia que los usuarios pueden realizar citas.
         </div>

         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="logo"><?php echo __("Hora Fin *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('horaFinVisita', $horas, array('class' => 'input-large')); ?>&nbsp;Horas&nbsp;<?php echo $this->Form->select('minutosFinVisitas', $minutosHoras, array('class' => 'input-large')); ?>&nbsp;Minutos
                  <span id="sp_error" style="display:none;" name="horaFinVisita" class="label label-important"></span>
               </div>
            </div>
         </div>
      </fieldset>

      <fieldset>
         <legend>Duración Cita</legend>
         <div class="row-fluid">
            Duración máxima: Tiempo en minutos maximo que podra programarse una cita por los usuarios.
         </div>

         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="logo"><?php echo __("Dur. Maxima *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('duracionMaxima', $minutos, array('class' => 'input-large')); ?>&nbsp;&nbsp;Minutos
                  <span id="sp_error" style="display:none;" name="duracionMaxima" class="label label-important"></span>
               </div>
            </div>
         </div>
      </fieldset>

   </div>
   <!-- Fin segunda tab horario  -->

   <!-- Inicia tercera tercera tab entrada a visita -->
   <div id="tabs-3">
      <fieldset>
         <legend>Entradas a citas</legend>
         <div class="row-fluid">
            Puntualidad Permitida: Es el tiempo en minutos m&aacute;ximo en el que un visitante puede entrar a su cita, restringiendole el acceso
            hasta que este tiempo sea alcanzado. Por ejemplo: Si un visitante tiene una cita a las 8:00:00AM y este valor es 10 el visitante solo podra
            acceder a su organización despues de las 7:50:00AM.
         </div>

         <div class="row-fluid">
               <div class="control-group">
                  <label class="control-label" for="logo"><?php echo __("Interv. de tiempo *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->select('intervalos', $minutos, array('class' => 'input-large')); ?>&nbsp;&nbsp;Minutos
                  </div>
               </div>
         </div>

         <div class="row-fluid">
            Retardo Permitido: Es el tiempo en minutos ma&acuteximo en el que un visitante podr&aacute llegar despues de su cita programada, si el visitante llega despues de este tiempo el sistema
            cancelara si cita programada. Por ejemplo tomando como referencia el caso anterior, se tiene una cita a las 8:00:00AM y este valor es 20, 
            el visitante solo podra acceder a su organización hasta las 8:20:00AM.
         </div>
      </fieldset>
      
      <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="logo"><?php echo __("Retardo Permitido *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('retardoPermitido', $minutos, array('class' => 'input-large')); ?>&nbsp;&nbsp;Minutos
               </div>
            </div>
      </div>

      <fieldset>
         <legend>Duracion Minima</legend>
         <div class="row-fluid">
            Duración Minima : Timepo en minutos en el que el sistema considera como salida del visitante cuando ha registrado su acceso en un punto de chequeo.
         </div>

         <div class="row-fluid">
               <div class="control-group">
                  <label class="control-label" for="logo"><?php echo __("Duracion Minima *", true); ?></label>
                  <div class="controls">
                     <?php echo $this->Form->select('duracionMinima', $duracion, array('class' => 'input-large')); ?>&nbsp;&nbsp;Minutos
                  </div>
               </div>
         </div>
      </fieldset>

   </div>
   <!--  fin tercera tab hora a visita  -->

   <!--  inicia cuarta tab seguridad  -->
   <div id="tabs-4">

      <fieldset>
         <legend>Cuenta de Usuario</legend>
         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="geneCuentasUsuario"><?php echo __("Gen. Usuario *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('geneCuentasUsuario', array('1' => 'Manual', '2' => 'Automatica'), array('class' => 'input-large')); ?>
               </div>
            </div>
         </div>

         <div class="row-fluid">
            Cuentas de Usuario: Cuenta con dos posibles opciones,  la de manual o la automatica, si se selecciona la 'Manual'; cuando se genere un nuevo
            empleado se tendra que capturar manualmente su nombre de usuario, en cambio si se selecciona esta opcion a 'Automatico' el sistema genera un nombre de usuario
            formado por la primera letra de su nombre seguido de su apehido paterno, teniendo la opcion de modificarlo.
         </div>
      </fieldset>

      <fieldset>
         <legend>Cambio de contraseña</legend>
         <div class="row-fluid">
            Cambio de Contraseña: Si esta opcion se encuentra habilitada el sistema solicita al usuario los dias de caducidad, para que cada vez que el usuario ingrese
            el sistema se valide que la fecha de la ultima actualizacion de su contraseña no este caducada, esto por cuestiones de seguridad en las contraseñas.
            Por ejemplo si la contraseña se actualizo el 31 de marzo y el valor de los dias de caducidad es 15 el sistema solicitara el cambio de contraseña.
         </div>

         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="cambioContrasena"><?php echo __("Cambio Contraseña *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('cambioContrasena', array('1' => 'Habilitar', '2' => 'Desabilitar'), array('class' => 'input-large')); ?>
               </div>
            </div>
         </div>
         
         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="diasCaducidad"><?php echo __("Caducidad *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('diasCaducidad', array('label' => FALSE, 'maxlength' => '50', 'id' => 'razonSocial', 'class' => 'input-large')); ?>
               </div>
            </div>
         </div>
      </fieldset>

      <fieldset>
         <legend>Cuenta de Usuario</legend>
         <div class="row-fluid">
            Autentificación de Usuarios: El sistema mediante este parametro restringe que solo se pueda acceder al sistema a travez de huella digital,
            desabilitando el acceso al usuario atravez de nombre usuario y contraseña. Esto para lugares en donde la seguridad sea un aspecto muy importante.
         </div>

         <div class="row-fluid">
            <div class="control-group">
               <label class="control-label" for="formaAutenticacion"><?php echo __("Autenticación de Usuarios *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('formaAutenticacion', array('1' => 'Contraseña Huella Digital', '2' => 'Solo Huella Digital'), array('class' => 'input-large')); ?>&nbsp;
               </div>
            </div>
         </div>
      </fieldset>

   </div>
   <!--  fin cuarta tab seguridad  -->
   
   <!--  Botones de acciones -->
   <div class="control-group">
      <div id="acciones" class="controls">
         <?php echo$this->Form->button(__('Cancelar', true), array('type' => 'button', 'id' => 'cancelar', 'class' => 'btn btn-second ')); ?>
         <?php echo$this->Form->button(__('Guardar', true), array('type' => 'submit', 'id' => 'guardar', 'class' => 'btn btn-primary')); ?>
      </div>
   </div>

   <?php echo $this->Form->end(); ?>
</div>

<script type="text/javascript" src="/js/plugins/ajaxForm/jquery.ajaxForm.js"></script>
<script type="text/javascript" src="/js/library/crudLibrary.js"></script>
<script type="text/javascript" src="/js/implementaciones/configuraciones/edit.js"></script>