
<?php $options = array(); ?>

<h3 class="ui-widget-header"><?php echo __("Nueva Empresa",true); ?></h3>
<div id="tabs">

   <ul>
      <li><a href="#tab-1">Empresas</a></li>
   </ul>
   
   <?php echo $this->Form->create("Empresa", array('action' => 'add', 'type' => 'file', 'onkeypress' => 'return event.keyCode!=13', 'id' => 'Form00', 'class' => 'form-horizontal')); ?>
   
   <!-- Primer tab datos generales -->
   <div id="tab-1">
      <fieldset>
         <legend>Datos Generales</legend>
      <div class="row-fluid">

         <div class="span8">

            <div class="control-group">
               <label class="control-label" for="razonSocial"><?php echo __("Razon Social *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('razonSocial', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'razonSocial', 'class' => 'input-xxlarge')); ?>
                  <span id="sp_error" style="display:none;" name="razonSocial" class="label label-important"></span>
               </div>
            </div>

            <div class="control-group">
               <label class="control-label" for="rfc"><?php echo __("Rfc *", true); ?> &nbsp;&nbsp;</label>
               <div class="controls">
                  <?php echo $this->Form->input('rfc', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'rfc', 'class' => 'input-xxlarge')); ?>
                  <span id="sp_error" style="display:none;" name="rfc" class="label label-important"></span>
               </div>
            </div>

            <div class="control-group">
               <label class="control-label" for="regimenFiscal"><?php echo __("Reg. Fiscal *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('regimenFiscal', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'regimenFiscal', 'class' => 'input-xxlarge')); ?>
                  <span id="sp_error" style="display:none;" name="regimenFiscal" class="label label-important"></span>
               </div>
            </div>

         </div>

      </div>

      <div class="row-fluid">

         <div class="span4">

            <div class="control-group">
               <label class="control-label" for="telefono"><?php echo __("Telefono *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('telefono', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'telefono', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="telefono" class="label label-important"></span>
               </div>
            </div>

            <div class="control-group">
               <label class="control-label" for="fax"><?php echo __("Fax *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('fax', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="fax" class="label label-important"></span>
               </div>
            </div>

            <div class="control-group">
               <label class="control-label" for="email"><?php echo __("Email *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('email', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="email" class="label label-important"></span>
               </div>
            </div>

            <div class="control-group">
               <label class="control-label" for="url"><?php echo __("Url *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('url', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="url" class="label label-important"></span>
               </div>
            </div>

            <div class="control-group">
               <label class="control-label" for="logo"><?php echo __("Logo *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('imglogo', array('label' => FALSE, 'type' => 'text', 'type' => 'file', 'maxlength' => '50', 'id' => 'fax', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="logo" class="label label-important"></span>
               </div>
            </div>

         </div>
         
         <div class="span1"></div>

         <div class="span3">
            <?php echo $this->Html->image('logo-tebas.jpg'); ?>
         </div>

      </div>
     </fieldset>
  
   <!-- Fin perimer tab -->
   
   <!-- Inicia Segunda tab Ubicación -->
   
   
      <fieldset>
         <legend>Ubicacion</legend>
       <div class="row-fluid">

          <div class="span8">
             
             <div class="control-group">
               <label class="control-label" for="calle"><?php echo __("Calle *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('calle', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'calle', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="calle" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="codigoPostal"><?php echo __("Codigo Postal *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('codigoPostal', array('label' =>FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'codigoPostal', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="codigoPostal" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="numInterior"><?php echo __("Num. Interior *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('numInterior', array('label' =>FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'numInterior', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="numInterior" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="numExterior"><?php echo __("Num. Exterior *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('numExterior', array('label' =>FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'numExterior', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="numExterior" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="colonia"><?php echo __("Colonia *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('colonia', array('label' =>FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'colonia', 'class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="colonia" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="gralPaisId"><?php echo __("Pais *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('gralPaisId', $paises, array('class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="gralPaisId" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="gralEstadoId"><?php echo __("Estado *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('gralEstadoId', $options, array('class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="gralEstadoId" class="label label-important"></span>
               </div>
            </div>
             
             <div class="control-group">
               <label class="control-label" for="gralMunicipioId"><?php echo __("Municipio *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('gralMunicipioId', $options, array('class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="gralMunicipioId" class="label label-important"></span>
               </div>
            </div>
             
          </div>
          
       </div>
         </fieldset>
   </div>
   
   <!-- Fin segunda tab -->
   
   <div class="control-group">
      <div id="acciones" class="controls">
         <?php echo$this->Form->button(__('Cancelar', true), array('type' => 'button', 'id' => 'cancelar', 'class'=>'btn btn-second ')); ?>
         <?php echo$this->Form->button(__('Guardar', true), array('type' => 'submit', 'id' => 'guardar', 'class'=>'btn btn-primary')); ?>
      </div>
   </div>
   
   <?php echo $this->Form->end(); ?>
   
</div>

<script type="text/javascript" src="/js/implementaciones/empresas/add.js"></script>