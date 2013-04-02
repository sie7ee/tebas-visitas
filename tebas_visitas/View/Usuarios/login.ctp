<?php echo $this->Html->css('plugins/msgBox/jquery.msgbox');  ?>
<?php echo $this->Html->script('jquery');?>
<?php echo $this->Html->script('jquery-ui-1.8.24.custom.min');?>
<?php echo $this->Html->script('plugins/touchPunch/jquery.ui.touch-punch.min');?>
<?php echo $this->Html->script('bootstrap');?>
<?php echo $this->Html->script('plugins/msgBox/jquery.msgbox.min');?>
<?php echo $this->Html->script('plugins/jquery-form/jquery-form');?>
<?php echo $this->Html->script('implementaciones/usuarios/login');?>


<div style="margin: 3.5em auto; text-align: center;">
    <?php echo $this->Html->image('logo-white.png',array())?>
</div> 

<div class="account-container login stacked">

   <div class="content clearfix">
     
	<?php echo $this->Form->create("Usuario", array('action' => 'login','id'=>'Form')); ?>
      <h1>Login</h1>		

      <div class="login-fields">

         <p>Ingresa tu cuenta y contraseña:</p>

         <div class="field">           
			<?php echo $this->Form->input('correo_electronico', array('type'=>'text','label' =>false,'placeholder'=>'Correo Electrónico','class'=>'login username-field'));?>			
         </div> 
		 
         <div class="field">           
			<?php echo $this->Form->input('clave_secreta', array('type'=>'password','label' =>false,'placeholder'=>'Contraseña','class'=>'login password-field'));?>			
			
         </div> 

      </div> <!-- /login-fields -->

      <div class="login-actions">

         <span class="login-checkbox">
			<?php echo $this->Html->link(__('&iquest; Has olvidado tu contrase&ntilde;a &#63;',true),array('controller'=>"usuarios",'action'=>"recuperar_cuenta"),array("escape"=>false));?>   									
         </span>        
         <a href="#" id="acceder" name="acceder" class="button btn btn-primary btn-large">Acceder</a>

      </div> <!-- .actions -->

      	<?php echo $this->Form->end();?>	 

   </div> <!-- /content -->

</div> <!-- /account-container -->
