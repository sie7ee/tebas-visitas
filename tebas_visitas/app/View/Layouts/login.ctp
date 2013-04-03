<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> 
<html class="no-js" lang="en"> <!--<![endif]-->
   <head>
      <?php echo $this->Html->charset('ISO-8859-1'); ?>
      <title>Dashboard Admin</title>

      <meta name="description" content="">
      <meta name="author" content="">

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="apple-mobile-web-app-capable" content="yes">

    <?php echo $this->Html->css('font-awesome');?>
	<?php echo $this->Html->css('http://fonts.googleapis.com/css?family=Open+Sans:400,600,800');?>	  
	<?php echo $this->Html->css('bootstrap');?>	      
	<?php echo $this->Html->css('jquery-ui-1.9.0.custom');?>
	<?php echo $this->Html->css('application');?>
	<?php echo $this->Html->script('plugins/modernizr/modernizr-2.5.3.min');?>
	<?php echo $this->fetch('meta');?>
	<?php echo $this->fetch('css');?>	
	<?php echo $this->fetch('script');?>
   </head>

   <body class="login">
            <?php echo $this->Session->flash(); ?>
			<?php echo $this->fetch('content'); ?>           
			<input id="hd_url_proyect" value="<?=$this->getVar("url_proyect");?>" type="hidden"/>
   </body>
</html>
