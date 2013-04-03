<div style="margin: 3.5em auto; text-align: center;">
   <img src="<?php echo base_url('img/logo-white.png'); ?>" />
</div> 

<div class="account-container login stacked">

   <div class="content clearfix">

      <?php echo form_open(); ?>

      <h1>Login</h1>		

      <div class="login-fields">

         <p>Ingresa tu cuenta y contraseña:</p>

         <div class="field">
            <?php echo form_label('Nombre de usuario'); ?>
            <?php echo form_input('username', '', 'id="username" placeholder="usuario" class="login username-field"'); ?>
         </div> 

         <div class="field">
            <?php echo form_label('Contraseña'); ?>
            <?php echo form_password('password', '', 'id="password" placeholder="Password" class="login password-field"'); ?>
         </div> 

      </div> <!-- /login-fields -->

      <div class="login-actions">

         <span class="login-checkbox">
            <a href="#">Olvide Mi Contrasña</a>
         </span>

         <?php // echo form_button('Acceder', 'Acceder', 'id="acceder" class="button btn btn-primary btn-large"'); ?>
         <a href="#" id="acceder" name="acceder" class="button btn btn-primary btn-large">Acceder</a>

      </div> <!-- .actions -->

      <?php echo form_close(); ?>

   </div> <!-- /content -->

</div> <!-- /account-container -->

<link rel="stylesheet" href="<?php echo base_url('css/plugins/msgBox/jquery.msgbox.css'); ?> ">

<script src="<?php echo base_url('js/jquery.js'); ?> "></script>
<script src="<?php echo base_url('js/jquery-ui-1.8.24.custom.min.js'); ?>"></script>
<script src="<?php echo base_url('js/plugins/touchPunch/jquery.ui.touch-punch.min.js'); ?> "></script>
<script src="<?php echo base_url('js/bootstrap.js'); ?>"></script>
<script src="<?php echo base_url('js/plugins/msgBox/jquery.msgbox.min.js'); ?>"></script>
<script src="<?php echo base_url('js/modules/login/login.js'); ?>"></script>