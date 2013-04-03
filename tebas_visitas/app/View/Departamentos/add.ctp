
<?php $options = array(); ?>

<h3 class="ui-widget-header"><?php echo __("Nuevo Registro", true); ?></h3>
<div id="tabs">

    <ul>
        <li><a href="#tab-1">Departamento</a></li>
        <li><a href="#tab-2">Administracion</a></li>
    </ul>

    <?php echo $this->Form->create("Departamento", array('action' => 'add', 'type' => 'file', 'onkeypress' => 'return event.keyCode!=13', 'id' => 'Form00', 'class' => 'form-horizontal')); ?>

    <!-- Primer tab datos generales -->
    <div id="tab-1">
        <fieldset>
            <legend>Datos generales</legend>
            <div class="row-fluid">

                <div class="span8">

                    <div class="control-group">
                        <label class="control-label" for="nombre"><?php echo __("Nombre *", true); ?></label>
                        <div class="controls">
                            <?php echo $this->Form->input('nombre', array('label' => FALSE, 'type' => 'text', 'maxlength' => '50', 'id' => 'nombre', 'class' => 'input-xxlarge')); ?>
                            <span id="sp_error" style="display:none;" name="razonSocial" class="label label-important"></span>
                        </div>
                    </div>

                </div>
            </div>

        </fieldset>
    </div>
    <div id="tab-2">
        <fieldset>
            <legend>Administracion</legend>
            <div class="row-fluid">
            
            <div class="control-group">
               <label class="control-label" for="titulo"><?php echo __("Empresa *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('gralEmpresaId', $empresas, array('class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="gralEmpresaId" class="label label-important"></span>
               </div>
            </div>
             <div class="control-group">
               <label class="control-label" for="titulo"><?php echo __("Sucursal *", true); ?></label>
               <div class="controls">
                  <?php echo $this->Form->select('gralSucursalId', $options, array('class' => 'input-large')); ?>
                  <span id="sp_error" style="display:none;" name="gralSucursalId" class="label label-important"></span>
               </div>
            </div>
            
         </div>
        </fieldset>
       </div> 
        <!-- Fin perimer tab -->


        <div class="control-group">
            <div id="acciones" class="controls">
                <?php echo$this->Form->button(__('Cancelar', true), array('type' => 'button', 'id' => 'cancelar', 'class' => 'btn btn-second ')); ?>
                <?php echo$this->Form->button(__('Guardar', true), array('type' => 'submit', 'id' => 'guardar', 'class' => 'btn btn-primary')); ?>
            </div>
        </div>

        <?php echo $this->Form->end(); ?>

    </div>

    <script type="text/javascript" src="/js/implementaciones/departamentos/add.js"></script>