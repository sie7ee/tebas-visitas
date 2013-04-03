<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
   <head>
      <title><?php echo $title_for_layout; ?></title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta charset='utf-8'> 
      <?php
      echo $this->Html->meta('icon');

      echo $this->Html->css('font-awesome');
      echo $this->Html->css('bootstrap');
      //echo $this->Html->css('http://fonts.googleapis.com/css?family=Open+Sans:400,600,800');
      echo $this->Html->css('jquery-ui-1.9.0.custom');
      echo $this->Html->css('application');
      echo $this->Html->css('dashboard');
      echo $this->Html->css('plugins/msgBox/jquery.msgbox');
      echo $this->Html->css('plugins/validationEngine/validationEngine.jquery');
      echo $this->Html->css('plugins/msgGrowl/jquery.msgGrowl');

      echo $this->fetch('meta');
      echo $this->fetch('css');


      echo $this->Html->script('plugins/modernizr/modernizr-2.5.3.min');
      echo $this->Html->script('jquery');
      echo $this->Html->script('bootstrap');
      echo $this->Html->script('plugins/msgBox/jquery.msgbox.min');
      echo $this->Html->script('jqueryui');
      echo $this->Html->script('plugins/msgGrowl/jquery.msgGrowl');
      echo $this->fetch('script');
      ?>
   </head>

   <body>

      <div id="wrapper">

         <div id="topbar">

            <!-- seccion del usuario -->
            <div class="container">

               <a href="javascript:;" id="menu-trigger" class="dropdown-toggle" data-toggle="dropdown" data-target="#">
                  <i class="icon-cog"></i>
               </a>

               <div id="top-nav">

                  <ul>
                     <li>Empresa</li>
                     <li><a href="javascript:void(0);" class="login-empresa-planta">Empresa1</a></li>
                     <li>Planta</li>
                     <li><a href="javascript:void(0);" class="login-empresa-planta">Planta1</a></li>
                  </ul>

                  <ul class="pull-right">
                     <li><a href=""><i class="icon-user"></i>Empleado 1 Empleado 1 Empleado 1</a></li>
                     <li><a href=""><span class="badge badge-primary">6</span> Nuevos Mensajes </a></li>
                     <li class="dropdown">
                        <a href="./pages/settings.html" class="dropdown-toggle" data-toggle="dropdown">
                           Opciones						
                           <b class="caret"></b>
                        </a>

                        <ul class="dropdown-menu pull-right" >
                           <li><a href="#" id="message-new">Redactar Mensaje</a></li>
                           <li><a href="#">Mi cuena</a></li>
                        </ul> 

                     </li>
                     <li>Cerrar Session</li>
                  </ul>

               </div> <!-- /#top-nav -->

            </div> 
            <!-- fin seccion del usuario  -->

         </div> <!-- /#topbar -->

         <header id="header">

            <div class="container">

               <a href="" class="brand">Thomas & Betts</a>

               <a href="javascript:;" class="btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                  <i class="icon-reorder"></i>
               </a>

               <nav class="nav-collapse">
                  <ul id="main-nav" class="nav pull-right">
                     <li class="nav-icon active">
                        <a href="">
                           <i class="icon-home"></i>
                           <span></span>        					
                        </a>
                     </li>

                     <li class="dropdown">   
                        <a href="javascrip:;" class="dropdown-toggle" data-toggle="dropdown">
                           <i class="icon-th"></i>
                           <span></span>        					
                        </a>
                        <ul class="dropdown-menu">
                           <li><a href="" ></a></li>
                        </ul>
                     </li>
                  </ul>
               </nav>

            </div> <!-- /.container -->

         </header> <!-- /#header -->

         <div id="masthead">
            <div class="container">
               <div class="masthead-pad" >
                  <div class="masthead-text">
                     <div style="max-width: 450px;">
                        <h2></h2>

                        <p></p>
                     </div> 
                  </div>

                  <div style="max-width: 80px">
                     <a href="" >
                        <img src="" width="65" heigth ="65" />
                     </a>
                  </div>
               </div>

            </div>

         </div> 

         <section id="content">

            <div class="container">

<?php echo $this->Session->flash(); ?>

               <?php echo $this->fetch('content'); ?>

            </div> 

         </section> 

      </div> <!-- /#wrapper -->

      <footer id="footer">
         <div class="container">
            <div class="row">
               <div class="span12">
                  All materials © Thomas & Betts Corporation 2005 - 
                  No material from this site may be copied, distributed or in any way	used without the expressed prior permission of Thomas & Betts.
               </div> <!-- /span6 -->
            </div> <!-- /row -->
         </div> <!-- /container -->   
      </footer> 

<?php echo $this->element('sql_dump'); ?>


      <input id="hd_url_proyect" value="<?php echo $this->getVar("url_proyect"); ?>" type="hidden"/>
   </body>
</html>
