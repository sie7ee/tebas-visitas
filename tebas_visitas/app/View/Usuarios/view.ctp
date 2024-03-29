<div id="Form" title="<?php echo __("Ver Usuario [ ".$this->data['Usuario']['id']." ]",true);?>">
	<?php echo $this->Form->create("Usuario", array('action' => 'view','onkeypress'=>'return event.keyCode!=13','id' => 'Form00')); ?>
	<?php echo  $this->Form->hidden('id',array('id'=>'id')); ?>	
    <div id="tabs">   
        <ul>
            <li><a href="#tabs-1"><?php echo __("Datos Personales",true); ?></a></li>                    
			<li><a href="#tabs-2"><?php echo __("Cuenta",true); ?></a></li> 			
      </ul>
        <div id="tabs-1">  	
			<table width="100%" border="0"  cellspacing="0" cellpadding="0">	  
			  <tr>
				<td><?php echo $this->Form->input('nombre', array('label' =>__("Nombre(s) *",true),'maxlength' =>'100', 'style' => 'width:99%;','id'=>'nombre','class'=>'ui-widget-content ui-corner-all'));?></td>
				<td width="2%"><?php echo $this->Html->image('error.png' , array('align' => 'right','name' => 'nombre','id' => 'img_error','style' => 'display:none;')); ?></td>
			  </tr> 			  
			</table>			
		</div>
        <div id="tabs-2"> 
			<table width="100%" border="0"  cellspacing="0" cellpadding="0">
			  <tr>
				<td><?php echo $this->Form->input('sucursal_id', array('type'=>'select','label' =>__("Sucursal *",true), 'style' => 'width:100%;','id'=>'sucursal_id','options'=>$sucursales,"empty"=>array(""=>" -- Seleccione aqui una Sucursal -- "),'class'=>'ui-widget-content ui-corner-all'));?></td>
				<td width="2%"><?php echo $this->Html->image('error.png' , array('align' => 'right','name' => 'sucursal_id','id' => 'img_error','style' => 'display:none;')); ?></td>
			  </tr>					
			  <tr>
				<td><?php echo $this->Form->input('email', array('label' =>__("Correo Electrónico *",true),'maxlength' =>'60', 'style' => 'width:99%;','id'=>'email','class'=>'ui-widget-content ui-corner-all'));?></td>
				<td width="2%"><?php echo $this->Html->image('error.png' , array('align' => 'right','name' => 'email','id' => 'img_error','style' => 'display:none;')); ?></td>
			  </tr> 			
			  <tr>
				<td><?php echo $this->Form->input('perfil_id', array('type'=>'select','label' =>__("Perfil *",true),'maxlength' =>'150', 'style' => 'width:100%;','id'=>'perfil_id','options'=>$perfiles,"default"=>"0",'class'=>'ui-widget-content ui-corner-all'));?></td>
				<td width="2%"><?php echo $this->Html->image('error.png' , array('align' => 'right','name' => 'perfil_id','id' => 'img_error','style' => 'display:none;')); ?></td>
			  </tr>
			  <tr>
				<td><?php echo $this->Form->input('estatus', array('type'=>'select','label' =>__("Estatus *",true),'style' => 'width:100%;','id'=>'estatus','options'=>$estatus,"default"=>"0",'class'=>'ui-widget-content ui-corner-all'));?></td>
				<td width="2%"><?php echo $this->Html->image('error.png' , array('align' => 'right','name' => 'estatus','id' => 'img_error','style' => 'display:none;')); ?></td>
			  </tr>  			   			  
			</table>		
		</div>	
	</div>
	<?php echo $this->Form->end();?>
	<span id="cmdcancelar" style="display:none;"><?php echo __("Cerrar",true);?></span>
</div>