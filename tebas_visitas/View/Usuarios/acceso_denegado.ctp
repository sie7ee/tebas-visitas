<?php  if(!$isajax):?>
<?php echo $this->Html->script("componentes/external/jquery.bgiframe-2.1.2",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.core",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.widget",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.mouse",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.draggable",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.position",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.resizable",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.dialog",false);?>
<?php echo $this->Html->script("componentes/jqueryui/ui/jquery.ui.button",false);?>
<?php echo $this->Html->script("waiting",false);?>

<p>
<h1 style="text-align:center;"><?php echo __("Acceso Denegado");?></h1>
</p>
<?php else:?>
<div id="Form" title="<?php echo __("Atencion!",true);?>">
	<div><?php  echo __("La url solicitada requiere permisos, Pongase en contacto con el administrador del sistema.",true);?></div>
	<span id="cmdaceptar" style="display:none;"></span>
	<span id="cmdcancelar" style="display:none;"><?php echo __("Aceptar",true);?></span>
</div>
<?php endif;?>
