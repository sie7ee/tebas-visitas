<?php echo $this->Html->script("componentes/external/jquery.bgiframe-2.1.2",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.core",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.widget",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.mouse",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.draggable",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.position",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.resizable",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.dialog",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.button",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.tabs",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.datepicker",false);?>
<?php echo $this->Html->script("componentes/jquery.showMessajeInfo",false);?>
<?php echo $this->Html->script("componentes/jquery.showMessajeError",false);?>
<?php echo $this->Html->script("componentes/jquery.showMessajeConfirm",false);?>
<?php echo $this->Html->script("componentes/jquery-form/jquery-form",false);?>
<?php echo $this->Html->script("waiting",false);?>
<?php echo $this->Html->script("componentes/jquery.paginador",false);?>
<?php echo $this->Html->script("implementaciones/usuarios/index",false);?>	
<?php echo $this->Html->script("implementaciones/usuarios/crud",false);?>	


<div id="content_grid">
<?php 
echo  $this->Form->hidden('url_getusuarios',array('id'=>'url_getusuarios','value'=>$this->Html->url(array("controller"=>$controlador,"action"=>$accion))));
echo $this->Datagridfiltro->genera_datagrid($controlador ,$accion ,$config_head,$total_filas,$filas_por_pagina, $pagina,$nombre_model,
							 $sentido_ordenamiento , $campo_ordenamiento,$operaciones,$url_proyect,$filtro,$titulo_catalago);							 							 
?>
</div>

<!-- definimos el mensaje para mostrar cualquier informacion remplezando al alert tradicional-->
<?php echo $this->datagridfiltro->showMessajeInfo();?>
<?php echo $this->datagridfiltro->showMessajeError();?>
<?php echo $this->datagridfiltro->showMessajeConfirm();?>