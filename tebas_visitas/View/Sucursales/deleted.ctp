<h3 class="ui-widget-header"><?php echo __("Editar Sucursal [" . $this->data['Sucursales']['id'] . "]",true); ?></h3>
<div id="tabs">

   <ul>
      <li><a href="#tab-1">General</a></li>
   </ul>
   
   <?php echo $this->Form->create("Sucursales", array('action' => 'deleted', 'type' => 'file', 'onkeypress' => 'return event.keyCode!=13', 'id' => 'Form00', 'class' => 'form-horizontal')); ?>
   <?php echo  $this->Form->hidden('id',array('id'=>'id')); ?>
   <div id="tab-1">
     
      <fieldset>
         <legend>Datos Generales</legend>
         <div class="row-fluid">
            
            <div class="control-group">
               <label class="control-label" for="titulo"><?php echo __("Titulo *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->input('titulo', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'titulo', 'class' => 'input-large')); ?>
               </div>
            </div>
            
            <div class="control-group">
               <label class="control-label" for="titulo"><?php echo __("Empresa *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('empresaId', $empresas, array('class' => 'input-large')); ?>
               </div>
            </div>
            
         </div>
      </fieldset>

      <!--  Botones de acciones -->
      <div class="control-group">
         <div id="acciones" class="controls">
            <?php echo$this->Form->button(__('No', true), array('type' => 'button', 'id' => 'cancelar', 'class' => 'btn btn-second ')); ?>
            <?php echo$this->Form->button(__('Si', true), array('type' => 'submit', 'id' => 'guardar', 'class' => 'btn btn-primary')); ?>
         </div>
      </div>

      <?php echo $this->Form->end(); ?>

   </div>
   
</div>

<script type="text/javascript" src="/js/implementaciones/sucursales/edit.js"></script>