<?php
echo $javascript->link("componentes/external/jquery.bgiframe-2.1.2",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.core",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.widget",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.mouse",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.draggable",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.position",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.resizable",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.dialog",false);
echo $javascript->link("componentes/jquery-form/jquery-form",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.button",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.tabs",false);
echo $javascript->link("componentes/jqueryui/ui/jquery.ui.datepicker",false);
echo $javascript->link("waiting",false);
echo $javascript->link("implementaciones/usuarios/cambiar_password_form",false);
?>

<br/>
<div style="width:500px; margin-left:10px;">
    <p>
    <h3><?php echo __("Cambiar Password",true); ?></h3>
    <hr/>
    </p>

	<?php echo $form->create(false, array('action'=>'cambiar_password/out.json','id'=>'Form00','onkeypress'=>'return event.keyCode!=13'));?>         
    <div id="tabs" >   
        <ul>
            <li><a href="#tabs-1" title="<?php echo __("Password",true); ?>"><?php echo __("Password",true); ?></a></li>             
        </ul>
        <div id="tabs-1">         
        <table width="100%" border="0"  cellspacing="0" cellpadding="0">   
        
          <tr>
            <td width="70%" height="28"><?php echo $form->input('pass_anterior',array('title'=>__('Ingrese aqui el password actual.',true),'label' =>__("Password Actual * ",true),'style' => 'width:98%;','class'=>'ui-widget-content ui-corner-all', 'id'=>'pass_anterior' ,'type'=>"password"));?></td>
            <td width="27%" height="28"><?php echo $html->image('error.png' , array('align' => 'left','name' => 'pass_anterior','id' => 'img_error','style' => 'display:none;')); ?></td>
            <td width="3%">&nbsp;</td>
          </tr>           
          
          <tr>
            <td width="70%" height="28"><?php echo $form->input('pass_1',array('title'=>__('Ingrese aqui el nuevo password.',true),'label' =>__("Nuevo Password * ",true),'style' => 'width:98%;','class'=>'ui-widget-content ui-corner-all', 'id'=>'pass_1' ,'type'=>"password",'maxlength' => '10'));?></td>
            <td width="27%" height="28"><?php echo $html->image('error.png' , array('align' => 'left','name' => 'pass_1','id' => 'img_error','style' => 'display:none;')); ?></td>
            <td width="3%">&nbsp;</td>
          </tr>
          
          <tr>
            <td width="70%" height="28"><?php echo $form->input('pass_2',array('title'=>__('Vuelva a ingresar el nuevo password para confirmar.',true),'label' =>__("Confirmación de Nuevo Password * ",true),'style' => 'width:98%;','class'=>'ui-widget-content ui-corner-all', 'id'=>'pass_2','type'=>"password",'maxlength' => '10'));?></td>
            <td width="27%" height="28"><?php echo $html->image('error.png' , array('align' => 'left','name' => 'pass_2','id' => 'img_error','style' => 'display:none;')); ?></td>
            <td width="3%">&nbsp;</td>
          </tr>                          
                                              
        </table>             
        </div> 
        
	<br/>
    <div align="right">
    <hr/>
	<button id="cmdguardar" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-disk"></span><?php echo __("Actualizar",true); ?></button>
    </div>
                    
    </div>
<?php echo $form->end(); ?>  
    
</div>

<?php echo $datagridfiltro->showMessaje();?>
<?php echo $datagridfiltro->showMessajeConfirm();?>