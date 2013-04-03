<?php echo $this->Html->script("implementaciones/perfiles/edit",false);?>	
<h3 class="ui-widget-header"><?php echo __("Nuevo Perfil",true); ?></h3>
<?php echo $this->Form->create("Perfile", array('action' => 'edit','label'=>false,'id' => 'Form00','inputDefaults'=>array("div"=>false,'error'=>array('attributes' => array('wrap' => 'label','class'=>'label label-warning')) ) )); ?>
	  <?php echo $this->Form->input('id', array('type'=>'hidden')); ?>					  
      <fieldset>
        <legend>Datos Generales</legend>
		<div class="row-fluid">

			 <div class="span8">
				<div class="control-group">
				   <div class="controls">
					  <?php echo $this->Form->input('descripcion', array('type'=>'text','required'=>false,'label' => "Descripción *", 'maxlength' => '30', 'id' => 'descripcion', 'class' => 'input-xxlarge')); ?>					  
					  <span id="sp_error" style="display:none;" name="descripcion" class="label label-important"></span>		
				   </div>
				</div>

			 </div>

		</div>
     </fieldset>
   
   <div class="control-group">
      <div id="acciones" class="controls">         
         <?php echo$this->Form->button(__('Guardar', true), array('type' => 'submit', 'id' => 'guardar','class'=>'btn btn-primary btn-mini')); ?>
		 <?php echo$this->Form->button(__('Cancelar', true), array('type' => 'button', 'id' => 'cancelar','class'=>'btn btn-second btn-mini')); ?>
      </div>
   </div>   
   <?php echo $this->Form->end(); ?>   