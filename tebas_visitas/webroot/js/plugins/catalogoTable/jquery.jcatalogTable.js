;(function($, window, undefined){
      //m001e461b2252
      $.widget('hik.jcatalogTable', {
            
            options: {
                  
                  typeGrid:'crud',

                  //Options
                  actions: {},
                  fields: {},
                  buttons:{},
                  actionsRows:{},
                  animationsEnabled: true,
                  defaultDateFormat: 'yy-mm-dd',
                  dialogShowEffect: '{ effect: "drop", direction: "up" }',
                  dialogHideEffect: '{ effect: "drop", direction: "down" }',
                  showCloseButton: false,
                  
                  divForm:'',
                  
                  // funciones para sobre escribir metodos crud
                  add: undefined,
                  edit: undefined,
                  view: undefined,
                  deleted: undefined,

                  //Events
                  closeRequested: function (event, data) {},
                  loadingRecords: function (event, data) {},
                  recordsLoaded: function (event, data) {},
                  rowInserted: function (event, data) {},
                  rowsRemoved: function (event, data) {},
                  
                  //funciones para validar formuario crud
                  formCreated: function (event, data) {},
                  formSubmitting: function (event, data) {},
                  formClosed: function (event, data) {},
                  
                  //funciones para validar pivot y formulario del grid entry
                  formEntryCreated: function(event, data){},
                  formEntrySubmitting: function(event, data){},
                  formEntryClosed: function(){},
                  formSearchCreated:function(event, data){},
                  formSearchSubmittin:function(event, data){},
                  formSearchClosed:function(event, data){},
                  
                  configDialog:{
                        width:800,
                        height:300
                  },
                  
                  //Localization
                  messages: {
                        serverCommunicationError: 'A ocurrido un error al comunicarse con el servidor.',
                        msgAreYouSure:'Esta seguro que decea realizar esta accion ?',
                        loadingMessage: 'Cargando datos...',
                        noDataAvailable: 'Datos no disponibles!',
                        areYouSure: 'Seguro que desea continuar?',
                        save: 'Guardar',
                        saving: 'Guardando',
                        cancel: 'Cancelar',
                        error: 'Error',
                        close: 'Cerrar',
                        warning:'Atencion!',
                        cannotLoadOptionsFor: 'No se puede cargar los registros {0}'
                  },
            
                  permits: {
                        add:true,
                        edit:true,
                        view:true,
                        deleted:true,
                        pdf_grid:true,
                        excel_grid:true
                  }
            },
            
            _$mainContainer: null, //Reference to the main container of all elements that are created by this plug-in (jQuery object)
        
            _$divBox:null,
            _$divBoxHeader:null,
            _$divBoxNoMargin:null,
            _$formEntry:null,
            _$formCrud:null,

            _$table: null, //Reference to the main <table> (jQuery object)
            _$tableBody: null, //Reference to <body> in the table (jQuery object)
            _$tableRows: null, //Array of all <tr> in the table (except "no data" row) (jQuery object array)

            _$bottomPanel: null, //Reference to the panel at the bottom of the table (jQuery object)

            _$busyDiv: null, //Reference to the div that is used to block UI while busy (jQuery object)
            _$busyMessageDiv: null, //Reference to the div that is used to show some message when UI is blocked (jQuery object)
            _$errorDialogDiv: null, //Reference to the error dialog div (jQuery object)

            _columnList: null, //Name of all data columns in the table (select column and command columns are not included) (string array)
            _fieldList: null, //Name of all fields of a record (defined in fields option) (string array)
            _keyField: null, //Name of the key field of a record (that is defined as 'key: true' in the fields option) (string)

            _firstDataColumnOffset: 0, //Start index of first record field in table columns (some columns can be placed before first data column, such as select checkbox column) (integer)
            _lastPostData: null, //Last posted data on load method (object)

            _cache: null, //General purpose cache dictionary (object)
            
            _order: null,
            _limit: null,
            _offset: null,
            _campo: null,
            _pagTotal:null,
            _postData: null,
            _totalRows: null,
            _totalRowsSearch: null,
            _pagHasta:null,
            _paginaActual: 1,
            _aSqlPivot:false,
            _searchFast:false,
            _search:false,
            _msgLoad:{},
            
            _create: function () {
                  //Initialization
                  this._normalizeFieldsOptions();
                  this._initializeFields();
                  this._createFieldAndColumnList();

                  //Creating DOM elements
                  this._createContainerGrid();
                  this._createTableTitle();
                  this._createSearchFast();
                  this._createButtonsGrid();
                  this._createTable();
                  this._createBottomPanel();
                  //this._createBusyPanel();checar mas adelante esto
                  this._createErrorDialogDiv();
                  //this._addNoDataRow();checar mas adelante esto
            },
            
            _normalizeFieldsOptions: function () {
            var self = this;
            $.each(self.options.fields, function (fieldName, props) {
                self._normalizeFieldOptions(fieldName, props);
            });
        },

        /* Normalizes some options for a field (sets default values).
        *************************************************************************/
        _normalizeFieldOptions: function (fieldName, props) {
            props.listClass = props.listClass || '';
            props.inputClass = props.inputClass || '';
        },
        
         _initializeFields: function () {
            this._$mainContainer = this.element;
            this._lastPostData = {};
            this._$tableRows = [];
            this._columnList = [];
            this._fieldList = [];
            this._cache = [];
            
            this._totalRows = 0;
            this._totalRowsSearch = 0;
            this._order = this.options.paginate.order;
            this._limit = this.options.paginate.limit;
            this._offset = this.options.paginate.offset;
            this._campo = this.options.paginate.campo;
            this._paginaActual = 1;
        },
        
        /* Fills _fieldList, _columnList arrays and sets _keyField variable.
        *************************************************************************/
        _createFieldAndColumnList: function () {
            var self = this;

            $.each(self.options.fields, function (name, props) {

                //Add field to the field list
                self._fieldList.push(name);

                //Check if this field is the key field
                if (props.key == true) {
                    self._keyField = name;
                }

                //Add field to column list if it is shown in the table
                if (props.list != false && props.type != 'hidden') {
                    self._columnList.push(name);
                }
            });
        },
        
        _createContainerGrid: function(){
                  var containerTable = $('<div></div>').addClass('row-fluid').appendTo(this._$mainContainer);
                  var containerSpan = $('<div></div>').addClass('span12').appendTo(containerTable);
                  var divBox = $('<div></div>').addClass('box').appendTo(containerSpan);
                  var divBoxHeader = $('<div></div>').addClass('box-info-table box-head tabs').appendTo(divBox);
                  
                  this._$divBox = divBox;
                  this._$divBoxHeader = divBoxHeader;
            },
            
            _createTableTitle: function(){
                  
                  //validamos si el usuario ingreso una configuracion para el nombre que tendra la tabla, si no 
                  // interrumpimos el proceso
                  if(this.options.title == ''){
                        return;
                  }
                   
                  //creamos una etiqueta html h3 que contendra el titulo de la tabla en el grid
                  $('<h3 style="width:15%;"></h3>').appendTo(this._$divBoxHeader).text(this.options.title);
            },
            
           
    
          _createButtonsGrid: function(){
                  var self = this;
                  // creamos el ul que contendra los botones
                  var contButtons = $('<ul><ul>').addClass('nav nav-tabs').appendTo(this._$divBoxHeader);                
                  //creamos los botones crud
                  self._createButtonsCrud(contButtons);               
                  //recorremos los botones que creo el usuario
                  $.each(self.options.buttons, function(keyButtons, buttons){                       
                        //validamos si tiene permisos para agregar el boton
                        if(buttons.permit){
                              //creamos el boton
                              self._createOptionButton(contButtons, buttons);
                        }
                  });
            },
            
            /**
             * crea los botones crud de nuevo, pdf, excel que estaran por default en un crud
             */
            _createButtonsCrud: function(contButtons){
                  var self = this;
                  
                  // validamos que exista una url a donde mandar los datos de la paginacion
                  if((self.options.actions.createAction != undefined) && (self.options.permits.add) && (self.options.typeGrid == 'crud')){
                        callback = (self.options.add != undefined) ? self.options.add : self.add;
                        self._createOptionButton(contButtons,{
                              title: 'Nuevo',
                              fn:callback,
                              permit: self.options.permits.add
                        });
                  }
                  
                  // validamos que exista una url a donde mandar los datos de la paginacion
                  if((self.options.actions.pdfAction != undefined) && (self.options.permits.pdf_grid)){
                        callback = (typeof self.options.pdf != 'undefined') ? self.options.pdf : self.pdf;                     
                        self._createOptionButton(contButtons,{
                              title: 'Pdf',
                              fn:callback,
                              permit: self.options.permits.pdf
                        });
                  }
                  
                  // validamos que exista una url a donde mandar los datos de la paginacion
                  if((self.options.actions.excelAction != undefined) && (self.options.permits.excel_grid)){
                        callback = (self.options.excel != undefined) ? self.options.excel : self.excel;
                        self._createOptionButton(contButtons,{
                              title: 'Excel',
                              fn:callback,
                              permit: self.options.permits.pdf
                        });
                  }
            },
            
            _createOptionButton: function(contButtons, button){
                  var self = this;
                  var li = $('<li></li>').appendTo(contButtons);   
                  var boton = $('<a></a>').text(button.title).attr('id', button.title).attr('href', '#').attr('data-toggle', 'tab').appendTo(li);
                  
                  boton.on('click', function(e){
                        e.preventDefault();
                        button.fn.call(this, self);
                  });
            },
            
            _createTable: function(){
                  var nameItem = this._$mainContainer.attr('id');
                  var divBoxNoMargin = $('<div></div>').addClass('box-content box-nomargen').appendTo(this._$divBox);
                  
                  if(this.options.typeGrid == 'entry'){
                        var formEntry = $('<form></form>').attr('id', 'form-entry-' + nameItem).attr('name', 'form-entry-' + nameItem).appendTo(divBoxNoMargin);
                  }
                  
                  var table = $('<table></table>').addClass('catalogo-table catalogo-table-striped catalogo-table-bordered table-hover').appendTo((formEntry != undefined) ? formEntry : divBoxNoMargin);
                  
                  this._$divBoxNoMargin = divBoxNoMargin;
                  this._$formEntry = formEntry;
                  this._$table = table;
                  this._createTableHead();
                  this._createTableBody();
            },
            
            _createTableHead: function () {
                  var $thead = $('<thead></thead>').appendTo(this._$table);
                  this._addRowToTableHead($thead);
            },
            
             _addRowToTableHead: function ($thead) {
                  var $tr = $('<tr></tr>').appendTo($thead);
                  this._addColumnsToHeaderRow($tr);
            },
            
            _addColumnsToHeaderRow: function ($tr) {
                 for(var i = 0; i < this._fieldList.length; i++){ 
                        var columnTitle = this._fieldList[i];
                        this._createHeaderCellForField(columnTitle, this.options.fields[columnTitle], $tr);
                  }
            },
            
            _createHeaderCellForField: function (fieldName, field, $tr) {
                  field.width = field.width || '10%';
                  var self = this;
                  var tth = $('<th></th>').attr('width', field.width).text(field.title).appendTo($tr);
                  if(field.sortable){
                        $('<span></span>').addClass("icon-arrow-down").appendTo(tth).click(function(){
                              self._campo = fieldName;
                              self._order = (self._order == 'ASC') ? 'DESC' : 'ASC';
                              self.load();
                        });
                  }
                  if(field.pivot){
                        $('<span></span>').addClass('icon-search').appendTo(tth).click(function(){
                              self._createDivPivot(field);
                        });
                  }
                  
                  return tth;
            },
            
            _createTableBody: function () {
                  var body = $('<tbody></tbody>').appendTo(this._$table);
                  this._$tableBody = body;
            },
            
            _createBottomPanel: function () {
                  var divBoxFooter = $('<div></div>').addClass('box-info-table box-footer').appendTo(this._$divBox);
                  this._$divBoxFooter = divBoxFooter;
            },
            
            _clearPaginate: function(){
                  this._$divBoxFooter.empty();
            },
            
            _createTablePaginator: function(){
                  this._clearPaginate();
                  this._createTablePagination();
                  this._createTablePages();
                  this._createSelectLimit();
            },
            
            _createTablePagination: function(){
                  var divButtonsPaginator = $('<div style="float:right; margin: 0;"><div>').addClass("pagination").appendTo(this._$divBoxFooter);
                  var ul = $('<ul></ul>').appendTo(divButtonsPaginator);
                  
                  this._createTableButtonsPaginator(ul);
            },
            
            _createTablePages: function(){
                  var spanPaginate = $('<span></span>').appendTo(this._$divBoxFooter);
                  this._$spanPaginate = spanPaginate;
            },
            
            _createSelectLimit: function(){
                  if(this.options.paginate.cbox_pagination){
                        var i = 10;
                        var self = this;
                        var divContent = $('<div></div>').css({ 'width':'150px','margin':'0 auto'}).appendTo(this._$divBoxFooter);
                        var select = $('<select></select>').css({'width':'100px', 'margin':'0 auto'}).appendTo(divContent);
                  
                        while(i <= 50){
                              $('<option></option>').val(i).text(i).appendTo(select);
                              i +=10;
                        }
                  
                        $('<option></option>').val(100).text('100').appendTo(select);
                        select.attr({'value' : self._limit});
                        select.change(function(){
                              var val = $(this).val();
                              self._limit = parseInt(val);
                              if(val != ''){
                                    self.load({
                                          order: self._order,
                                          limit: parseInt(val),
                                          offset: self._offset,
                                          campo: self._campo,
                                          sql: self._aSqlPivot,
                                          searchFast: self._searchFast
                                     });
                              }
                        });
                  }
            },
            
             _createTableButtonsPaginator: function(ul){
                  var self = this;
                  //iniciamos variables a utilizar
                  var intervalo = 3;
                  var pagina = parseInt(self._paginaActual);
                  var pagDesde = parseInt(pagina) - parseInt(intervalo);
                  var pagHasta = parseInt(pagina) + parseInt(intervalo);
                  var totalPaginas = self._totalPaginas((self._search != false ? self._totalRowsSearch : self._totalRows), this._limit);
                  var pagAux = 0;
                  
                  self._pagTotal = totalPaginas;
                  
                  if(pagDesde < 1){
                        pagDesde = 1;
                        pagHasta = 7;
                  }
                  if(pagHasta > totalPaginas){
                        pagDesde = totalPaginas - 6;
                        pagHasta = totalPaginas
                        
                        if(pagDesde < 1){
                           pagDesde = 1;   
                        }
                  }
                  li_inicio = $('<li></li>').appendTo(ul);
                  $('<a></a>').text('Inicio').attr('href', '1').appendTo(li_inicio).click(function(e){
                        e.preventDefault();
                        self._buttonClickPagination(1, self._limit);
                  });
                  li_atras = $('<li></li>').appendTo(ul);          
                  $('<a>&larr;</a>').attr('href', pagHasta).appendTo(li_atras).click(function(e){       
                        e.preventDefault();
                        pagAux = (parseInt(self._paginaActual) > 1) ? parseInt(self._paginaActual) - 1 : pagDesde;
                        self._buttonClickPagination(pagAux, self._limit);
                  });
                  // genersmos los numeros en el paginado 
                  for(var i = pagDesde; i <= pagHasta; i++){
                        li = $('<li></li>').appendTo(ul);
                        a = $('<a></a>').attr('href', i).text(i).appendTo(li).click(function(e){
                              e.preventDefault();
                              pagAux = parseInt($(this).attr('href'));
                              self._buttonClickPagination(pagAux, self._limit);
                        });
                        
                        // para marcar la pagina actual
                        if(parseInt(i) == parseInt(self._paginaActual)){
                              li.addClass('active');
                        }           
                  }
                  li_siguinte = $('<li></li>').appendTo(ul);
                  $('<a>&rarr;</a>').attr('href', '#').appendTo(li_siguinte).click(function(e){
                        e.preventDefault();
                        pagAux = (parseInt(self._paginaActual) < pagHasta) ? parseInt(self._paginaActual) + 1 : pagHasta;
                        self._buttonClickPagination(pagAux, self._limit);
                  });
                  li_fin = $('<li></li>').appendTo(ul);
                  $('<a></a>').text('Fin').attr('href', totalPaginas).appendTo(li_fin).click(function(e){
                        e.preventDefault();
                        self._buttonClickPagination(parseInt(totalPaginas), self._limit);
                  });
            },
            
            _totalPaginas: function(totalRows, limit){
                  var total = 0;
                  total = parseInt( totalRows/limit );		
                  if ( (totalRows%limit) > 0 ) {
                        total += 1;
                  }
                  return total;
            },
            
            _buttonClickPagination: function(page, limit){
                  var self = this;
                  if((self.onFormEntrySubmitting() == false) && (self.options.typeGrid == 'entry')){
                       alert("Existen errores");
                       return;
                  }
                  self._offset = page;
                  self._paginaActual = page;
                  self.load({
                        order: self._order,
                        limit: self._limit,
                        offset: self._offset,
                        campo: self._campo,
                        sql: self._aSqlPivot,
                        searchFast:self._searchFast
                  });
                  
            },
            
            _calularOffset:function(page, limit){
                  return (parseInt(page) * parseInt(limit)) - parseInt(limit);
            },
            
            _textPaginate: function(){
                  this._$spanPaginate.text('Pagina ' + this._paginaActual + ' de '+ this._pagTotal +' Items Busqueda(' + this._totalRowsSearch + ') Total Items(' + this._totalRows +')');
            },
            
            _createErrorDialogDiv: function () {
                  var self = this;
                  self._$errorDialogDiv = $('<div></div>').appendTo(self._$mainContainer);
                  self._$errorDialogDiv.dialog({
                        autoOpen: false,
                        show: self.options.dialogShowEffect,
                        hide: self.options.dialogHideEffect,
                        modal: true,
                        title: self.options.messages.error,
                        buttons: [{
                              text: self.options.messages.close,
                              click: function () {
                                    self._$errorDialogDiv.dialog('close');
                              }
                        }]
                  });
        },
        
         _performAjaxCall: function (url, postData, async, dataType, method, success, error) {
            $.ajax({
                url: url,
                data: postData,
                type: method,
                dataType:dataType,
                async: async,
                success: success,
                error: error
            });
        },
        
        _addRecordsToTable: function(records){
              var self = this;
              var $tr = {};
              $.each(records, function (index, record) {
                    $tr = $('<tr></tr>').appendTo(self._$tableBody);
                    $.each(self.options.fields, function(keyColumns, valueColumns){
                          if(keyColumns === 'actionsRows'){
                                    self._createTableRowsActions($tr, record.id);        
                          } else {
                                    self._createTableRowsData($tr, record[keyColumns], keyColumns, record.id);
                          }
                    });
              });
        },
        
        _createTableRowsData: function(ttr, value, keyColumns, id){
                  value = (value != undefined) ? value : '';
                  var self = this;
                  var td = $('<td></td>').appendTo(ttr);
                  var field = this.options.fields[keyColumns];
                  if((field.type != undefined) && (self.options.typeGrid == 'entry')){
                        var name = keyColumns + '_' + id;
                        var input = self._createInputForRecordField(field, name, value, id);
                        input.appendTo(td);
                  } else {
                        td.text(value);
                  }            
        },
            
     _createTableRowsActions: function(ttr, id){
            var self = this;
            var ttd = $('<td></td>').appendTo(ttr);
            self._createActionsCrud(id, ttd);
            //recorremos las acciones dadas de altas por el usuario para crear los botones correspondientes de cada accion
            $.each(self.options.actionsRows, function(keyAction, valueAction){
                  //validamos si la accion cuenta con permisos para ser mostrado de acuerdo al rol del usuario y sus permisos
                  if(valueAction.permit){
                        // creamos la accion
                        self._createTableTdAction(id, valueAction, ttd);
                  }
            }); 
      },
      
      _createActionsCrud:function(id, ttd){
                  var self = this;
                  //colocamos el boton de ver y validamos si el usuario ingreso su propia funcion para este proceso
                  if((this.options.actions.viewAction  != undefined) && (this.options.permits.view) && (this.options.typeGrid == 'crud')){
                        callback = (self.options.view != undefined) ? self.options.view : self.view;
                        this._createTableTdAction(id, {
                              title:'Ver',
                              fn:callback
                        }, ttd);
                  }
                  // colocamos el boton de eliminar y validamos si el usuario ingreso su propia funcion para este proceso
                  if((this.options.actions.deleteAction != undefined) && (this.options.permits.deleted) && (this.options.typeGrid == 'crud')){
                        callback = (self.options.deleted != undefined) ? self.options.deleted : self.deleted;
                        this._createTableTdAction(id, {
                              title:'Eliminar',
                              fn:callback
                        }, ttd);
                  }
            },
      
            _createTableTdAction: function(id, button, ttd){
                  var self = this;
                  var boton = $('<a></a>').css({'margin-left':'5px','margin-bottom':'7px'})
                      .addClass("btn btn-primary btn-mini").text(button.title).attr('id', id).appendTo(ttd);
                        // sino viene 
                        // validamos si se paso una funcion como paerametro
                        if(typeof button.fn === 'function'){
                              boton.on('click', function(e){
                                    e.preventDefault();
                                    button.fn.call(this, {id:id,objPlugin:self});
                              });
                        }
            },
            
        _showError: function(title, msg){
                  var self = this;
                  $('<div></div>').text(msg).appendTo(self._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        show: self.options.dialogShowEffect,
                        hide: self.options.dialogHideEffect,
                        title: title,
                        buttons: [{
                              text: self.options.messages.close,
                              click: function () {
                                    $(this).dialog('close');
                              }
                        }]
                  });
            },   
            
//        _createMsgLoad: function(){
//              var self = this;
//              self._msgLoad = $('<div></div>').text('Cargando ...').css('display', 'none').appendTo(self._$mainContainer);
//        },
//            
//        _showMsgLoad: function(){
//             this._msgLoad.css('display', 'block');
//        },
//        
//        _hideMsgLoad: function(){
//              this._msgLoad.hide();
//        },
        _reloadTable: function (completeCallback) {
            var self = this;
            console.log(self._lastPostData);
            self._performAjaxCall(
                self.options.actions.listAction,
                self._lastPostData,
                true, 
                'JSON',
                'POST',
                function (data) { 

                    //Show the error message if server returns error
                    if (data.success == false) {
                        self._aSqlPivot = false;
                        self._searchFast = false;
                        self._showError(self.options.messages.warning, self.options.messages.noDataAvailable || data.msg);
                        return;
                    }
                    
                    self._totalRows = (data.total_rows != undefined) ? data.total_rows : 0;
                    self._totalRowsSearch = (data.total_rows_search != undefined) ? data.total_rows_search : 0;
                    self._search = data.search;
                    
                    //Re-generate table rows
                    self._removeAllRows();
                    self._addRecordsToTable(data.data);
                    
                    // create pagination
                    self._createTablePaginator();
                    self._textPaginate();
                    self._createStatusPivot();
                    self._createStatusSearchFast(self._valueSearchFast);
                    
                    //validar formulario entrada de datos en el grid
                    self.onFormEntryCreated();
                    
                    //Call complete callback
                    if (completeCallback) {
                        completeCallback();
                    }
                },
                function () {
                    self._showError(self.options.messages.warning, self.options.messages.serverCommunicationError);
                });
        },
        
        _removeAllRows: function () {
            this._$tableBody.empty();
        },
        
        _returnPostData: function(postData){
              var self = this;
              var data = {
                        order: self._order,
                        limit: self._limit,
                        offset: self._offset,
                        campo: self._campo,
                        sql: self._aSqlPivot,
                        searchFast: self._searchFast
              };
              return (postData == undefined) ? data : postData;
        },
        
        load: function (postData, completeCallback) {
            this._lastPostData = this._returnPostData(postData);
            this._reloadTable(completeCallback);
        },
        
        reload:function(postData, completeCallback){
            this._initializeFields();  
            this._lastPostData = this._returnPostData(postData);
            this._reloadTable(completeCallback);
        },
        
        onFormEntryCreated: function(){
              
            this._trigger("formEntryCreated", null, { formEntry: this._$formEntry}); 
        },
        
        onFormEntrySubmitting:function(){
            this.onFormEntryClosed();
            return this._trigger("formEntrySubmitting", null, { formEntry: this._$formEntry});   
        },
        
        onFormEntryClosed: function(){
            this._trigger("formEntryClosed", null, { formEntry: this._$formEntry});   
        },
        
        onFormSearchCreated: function(){
            
            this._trigger("formSearchCreated", null, { formSearch: this._$formSearch}); 
        },
        
        onFormSearchSubmitting:function(){
              
            return this._trigger("formSearchSubmitting", null, { formSearch: this._$formSearch});   
        },
        
        onFormSearchClosed: function(){
            this._trigger("formSearchClosed", null, { formSearch: this._$formSearch});   
        },
        
        onFormCreated: function(){
              
              this._trigger("formCreated", null, {form: this._$formCrud});
        },
        
        onFormSubmitting: function(){
              
             return this._trigger("formSubmitting", null, {form: this._$formCrud});
        },
        
        onFormClosed: function(){
              
              this._trigger("formClosed", null, {form: this._$formCrud});
        },
        
        onFormClone: function(divForm, fn){

              this._formClone(divForm, fn);
        }
        
      });
      
})(jQuery, window);

;(function($, window, undefined){
  
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
            _$statusDivSearchFast: null,
            _valueSearchFast: null,
            _$formSearchFast:{},
            _$inputSearchFast:{},
            
            _createSearchFast: function(){
                  var self = this;
                  if(self.options.searchFast != undefined){
                        var formSearchFast = $('<form class="form-search" style="margin:0;width:35%;float:left;"></form>').appendTo(this._$divBoxHeader);
                        var inputSearch = $('<input type="text" class="search-query" placeholder="Buscar ..."/>').appendTo(formSearchFast);

                        inputSearch.keypress(function(e){
                              var value = $(this).val();
                              if(value != ''){
                                    self._searchFast = {
                                          columns:self._fieldList,
                                          value:value
                                    }
                                    self.load({
                                          order: self._order,
                                          limit: self._limit,
                                          campo: self._campo,
                                          offset:0,
                                          searchFast:self._searchFast
                                    });
                                    self._valueSearchFast = value;
                              }
                        });
                        
                        self._$formSearchFast = formSearchFast;
                        self._$inputSearchFast = inputSearch;
                  }      
            },
      
            _createStatusSearchFast: function(value){
                  
                  var self = this;
                  if(self._searchFast != false){
                        if( self._$statusDivSearchFast != null){
                              self._$statusDivSearchFast.remove();
                        }
                  
                        var spanPaginate = $('<span></span>').text('Busqueda Rapida = ' + value + ' ').appendTo(this._$divBoxFooter);
                  
                        $('<a href="#">x</a>').appendTo(spanPaginate).click(function(e){
                              e.preventDefault();
                              self._aSqlPivot = false;
                              self._searchFast = false;
                              self._$inputSearchFast.val('');
                              self.load();
                        });
                        self._$statusDivSearchFast = spanPaginate;
                  }
            }
      
      });
})(jQuery, window);

;(function($, window, undefined){
  
  $.extend(true, $.hik.jcatalogTable.prototype, {
        
        _$divContentAcordeion:null,
        //funcion encargada de clonar los formularios en la parte superior del grid
        _formClone: function(divForm, fn){
                  var self = this;
              
                  if(self._$divContentAcordeion != null){
                        self._$divContentAcordeion.remove();
                  }
              
                  // creamos el contenedor del acordeon que tendra el formulario
                  self._$divContentAcordeion = $('<div></div>').css('display', 'hidden').prependTo(self._$divBoxNoMargin);
              
                  // clonamos el formuario
                  var divFormClone = $('#' + divForm).clone();       
                  var formClone = divFormClone.find('form');
                  var idMainContainer = self._$mainContainer.attr('id');
                  var idDivFormClone = divFormClone.attr('id');
                  var idFormClone= formClone.attr('id');
                  
                  divFormClone.attr('id', idDivFormClone + '-' + idMainContainer);
                  formClone.attr('id', idFormClone + '-' + idMainContainer);
                  formClone.each(function(){
                        this.reset()
                  });
                  
                  // creamos el div
                  divFormClone.appendTo(self._$divContentAcordeion).slideDown('slow');
                  
                  //
                  fn({
                        objDivClone : divFormClone,
                        objFormClone: formClone,
                        idDivFormClone : divFormClone.attr('id'),
                        idFormClone : formClone.attr('id'),
                        fnBtnClose:function(){
                              self._$divContentAcordeion.slideUp(function(){
                                    $(this).remove();
                              });
                        }
                  });
            }
  });
  
})(jQuery, window);


/**
 * Clase que contiene la funcionalidad add del proceso de crud
 * el usuario debe tener los permisos de add en true para poder agregar un nuevo registro
 */
;(function($, window){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
      
      _$divContentAcordeion:null,
      
      /**
       * funcion add se encarga de iniciar con el proceso de nuevo, muestra el formulario con el nombre del id
       * que el usuario configuro en las opciones del plugin
       * 
       * @param self objeto del plugin que es pasado como parametro, devido que this cambia de valor
       */
      add: function(self){
                  // limpiamos el div contenedor
                  if(self._$divContentAcordeion != null){
                        self._$divContentAcordeion.remove();
                  }
                  
                  // creamos el contenedor del acordeon que tendra el formulario
                  self._$divContentAcordeion = $('<div></div>').css('display', 'hidden').prependTo(self._$divBoxNoMargin);
                  
                  // clonamos el formuario
                  var divForm = $('#' + self.options.divForm).clone();       
                  var formCrud = divForm.find('form');
                  var idMainContainer = self._$mainContainer.attr('id');
                  var idDivForm = divForm.attr('id');
                  var idFormCrud = formCrud.attr('id');
                  
                  // mostramos le asignamos nuevos ids al div y al formulario y lo receteamos
                  divForm.attr('id', idDivForm + '-' + idMainContainer);
                  formCrud.attr('id', idFormCrud + '-' + idMainContainer);
                  formCrud.each(function(){
                        this.reset()
                  });
                  
                  // creamos el div
                  divForm.appendTo(self._$divContentAcordeion).slideDown('slow');
                  
                  //inicializamos los tabs
                  divForm.tabs();
                  divForm.tabs('select', 'tabs-1');
                  
                  // agregamos la funcionalidad a los botons
                  formCrud.find('table').find('tr').find('td').find('button#btnAceptar').click(function(e){
                        e.preventDefault();
                        self._addSaveSubmit(formCrud);
                  });
                  formCrud.find('table').find('tr').find('td').find('button#btnCancelar').click(function(e){
                        e.preventDefault();
                        self._$divContentAcordeion.slideUp(function(){
                              $(this).remove();
                        });
                  });

                  //inicializamos el formulario para mandarlo llamar en el trigger y iniciamos las validaciones de validationEngine
                  self._$formCrud = formCrud;
                  self.onFormCreated();
            },
            
            /**
             * funcion que se encarga de mandar la informacion al servidor para realizar
             */
            _addSaveSubmit: function(formOrigin){
                  var self = this;
                  var dataForm = formOrigin.serialize();
                  $.ajax({
                        url: self.options.actions.createAction,
                        type:'POST',
                        data: dataForm,
                        async: false,
                        dataType: 'json',
                        success: function(data){ 
                              self._addSaveSuccess(formOrigin, data);
                        },
                        error: function(){
                              var div = $('<div></div>').appendTo(self._$mainContainer);
                              div.text(self.msg.msgServerCommunicationError).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    show: self.options.dialogShowEffect,
                                    hide: self.options.dialogHideEffect,
                                    title: 'Nuevo',
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                $(this).dialog('close');
                                          }
                                    }]
                              });
                        }
                  });
            }, 
            
            _addSaveSuccess: function(formOrigin, data){
                  var self = this;                  
                  var msg = '';
                  if(data.success){
                        //recargamos la tabla
                        self.reload();
                        //limpiamos el formulario
                        formOrigin.each(function(){
                              this.reset();
                        });
                        //ejecutamos el trigger que limpa los mensajes del formvalidation
                        self.onFormClosed();
                        //ingresamos el mesaje de success
                        msg = self.options.messages.addSaved || data.msg;
                  } else {
                        // ingresamos el mesaje de error
                        msg = self.options.messages.addError || data.msg;
                  }
                  $('<div></div>').text(msg).appendTo(this._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        show: self.options.dialogShowEffect,
                        hide: self.options.dialogHideEffect,
                        title: self.options.messages.btnClose,
                        buttons: [{
                              text: 'Cerrar',
                              click: function () {
                                    $(this).dialog('close');
                              }
                        }]
                  });
            }
      });
      
})(jQuery, window);

//metodos crud view
;(function($, window, undefined){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
            _$divContentAcordeion:null,
      
            view: function(params){
                  
                  var id = params.id;
                  var self = params.objPlugin;
                  
                  if(id != undefined){
                        $.ajax({
                              url: self.options.actions.viewAction,
                              type:'POST',
                              data:'id='+id,
                              dataType:'json',
                              async: false,
                              success: function(data){ 
                                    self._viewLoadData(id, data);
                              },
                              error: function(){
                                    var div = $('<div></div>').appendTo(self._$mainContainer);
                                    div.text(self.options.messages.msgServerCommunicationError).dialog({
                                          autoOpen: true,
                                          modal: true,
                                          show: self.options.dialogShowEffect,
                                          hide: self.options.dialogHideEffect,
                                          title: self.options.messages.btnSave,
                                          buttons: [{
                                                text: 'Cerrar',
                                                click: function () {
                                                      $(this).dialog('close');
                                                }
                                          }]
                                    });
                              }
                        });
                  }
            },
            
           _viewLoadData: function(id, data){
                 var self = this;
                  // limpiamos el div contenedor
                  if(self._$divContentAcordeion != null){
                        self._$divContentAcordeion.remove();
                  }
                   // creamos el contenedor del acordeon que tendra el formulario
                  self._$divContentAcordeion = $('<div></div>').css('display', 'hidden').prependTo(self._$divBoxNoMargin);
                 // clonamos el formuario
                  var divForm = $('#' + self.options.divForm).clone();       
                  var formCrud = divForm.find('form');
                  var idMainContainer = self._$mainContainer.attr('id');
                  var idDivForm = divForm.attr('id');
                  var idFormCrud = formCrud.attr('id');
                  
                  // mostramos le asignamos nuevos ids al div y al formulario y lo receteamos
                  divForm.attr('id', idDivForm + '-' + idMainContainer);
                  formCrud.attr('id', idFormCrud + '-' + idMainContainer);
                  formCrud.each(function(){
                        this.reset()
                  });
                  
                  self._$formCrud = formCrud;
                 if(data.success){
                        $.each(data.data[0], function(key, value){
                              self._$formCrud.find(':input').each(function(){
                                    var t = $(this);
                                    var type = this.type;
                                    var tag = this.tagName.toLowerCase();
                                    var name = t.attr('name');
                                    if(key == name){
                                          if(type == 'text' || type == 'textarea' || type == 'password'){
                                                t.val(value);     
                                          
                                          } else if(type == 'checkbox' || type == 'radio'){
                                                valor = t.val();
                                                if(valor == value){
                                                      t.attr('checked', 'checked');
                                                }
                                          } else if(tag == 'select'){
                                                t.find('option[value=' + value + ']').attr('selected', 'selected');
                                          }
                                    }
                              });
                        }); 
                  }
                  
                  self._showForm(id, divForm, self._$formCrud);
           },
           
           _showForm: function(id, divForm, formCrud){
                  var self = this;  
                  // creamos el div
                  divForm.appendTo(self._$divContentAcordeion).slideDown('slow');
                  
                  //inicializamos los tabs
                  divForm.tabs();
                  divForm.tabs('select', 'tabs-1');
                  
                  // agregamos la funcionalidad a los botons
                  formCrud.find('table').find('tr').find('td').find('button#btnAceptar').click(function(e){
                        e.preventDefault();
                        self.edit(id,formCrud);
                  });
                  formCrud.find('table').find('tr').find('td').find('button#btnCancelar').click(function(e){
                        e.preventDefault();
                        self._$divContentAcordeion.slideUp(function(){
                              $(this).remove();
                        });
                  });
                  
                  //inicializamos el formulario para mandarlo llamar en el trigger y iniciamos las validaciones de validationEngine
                  self._$formCrud = formCrud;
                  self.onFormCreated();
           }
            
      });
      
})(jQuery, window);

// funcionalidad editar
;(function($, window){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
            edit: function(id, formOrigin){
                  
                  var self = this;
                  var dataForm = formOrigin.serialize();
                  
                  $.ajax({
                        url: self.options.actions.updateAction,
                        type:'POST',
                        data: 'id='+id+'&'+dataForm,
                        async: false,
                        dataType:'json',
                        success: function(data){ 
                              self._editSuccess(data, formOrigin);
                        },
                        error: function(){
                              
                              var div = $('<div></div>').appendTo(self._$mainContainer);
                              div.text(self.options.messages.msgServerCommunicationError).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    show: self.options.dialogShowEffect,
                                    hide: self.options.dialogHideEffect,
                                    title: self.options.messages.btnSave,
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                $(this).dialog('close');
                                          }
                                    }]
                              });
                        }
                  });
            },
            
            _editSuccess: function(data, formOrigin){
                                    
                  var self = this;                  
                  var msg = '';
                  
                  if(data.success){
                        //recargamos la tabla
                        self.load();
                        //ejecutamos el trigger que limpa los mensajes del formvalidation
                        self.onFormClosed();
                        //ingresamos el mesaje de success
                        msg = self.options.messages.editSaved || data.msg;
                  } else {
                        // ingresamos el mesaje de error
                        msg = self.options.messages.editError || data.msg;
                  }
                  
                  $('<div></div>').text(msg).appendTo(this._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        title: self.options.messages.btnClose,
                        buttons: [{
                              text: 'Cerrar',
                              click: function () {
                                    $(this).dialog('close');
                              }
                        }]
                  });
            }
      })
      
})(jQuery, window);

;(function($, window){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
            deleted: function(params){
                  var self = params.objPlugin;
                  var id = params.id
                  var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(self._$mainContainer);
                  
                  div.text(self.options.messages.msgAreYouSure).dialog({
                        autoOpen: true,
                        modal: true,
                        show: self.options.dialogShowEffect,
                        hide: self.options.dialogHideEffect,
                        title: 'Atencion',
                        buttons: [{
                              text: 'Aceptar',
                              click: function () {
                                    self._deletedSubmit(id);
                                    $(this).dialog('close');
                              }
                        },{
                              text: 'Cancelar',
                              click: function () {
                                    $(this).dialog('close');
                              }
                        }]
                  });
            },
            
            _deletedSubmit: function(id){
                  
                  var self = this;                 

                  $.ajax({
                        url: self.options.actions.deleteAction,
                        type:'POST',
                        data: 'id='+id,
                        async: false,
                        dataType:'json',
                        success: function(data){ 
                              
                              self._deletedSuccess(data);
                        },
                        error: function(){
                              var div = $('<div></div>').appendTo(self._$mainContainer);
                              div.text(self.options.messages.msgServerCommunicationError).dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: self.options.messages.btnClose,
                                    buttons: [{
                                          text: 'Cerrar',
                                          click: function () {
                                                $(this).dialog('close');
                                          }
                                    }]
                              });
                        }
                  });
            },
            
            _deletedSuccess: function(data){
                  var self = this;                  
                  var msg = '';
                  if(data.success){
                        //recargamos la tabla
                        self.load();
                        //ingresamos el mesaje de success
                        msg = self.options.messages.deleteSubmit || data.msg;
                  } else {
                        // ingresamos el mesaje de error
                        msg = self.options.messages.deleteError || data.msg;
                  }
                  $('<div></div>').text(msg).appendTo(this._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        title: self.options.messages.btnClose,
                        buttons: [{
                              text: 'Cerrar',
                              click: function () {
                                    $(this).dialog('close');
                              }
                        }]
                  });
            }
      });
      
})(jQuery, window);


//metodos pdf
;(function($, window, undefined){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
             pdf: function(self){

                 if((self.options.actions.pdfAction != undefined) && (self.options.permits.pdf_grid)){
                       var form = $('<form action="' + self.options.actions.pdfAction + '" method="POST" target="parent" ></form>').appendTo(self._$mainContainer);
                       var filtro = self._returnPostData();
                       filtro = JSON.stringify(filtro);
                       $('<input type="hidden" name="busqueda" />').val(filtro).appendTo(form);
                       form.submit();
                       form.remove();
                 }
            }
      });
      
})(jQuery, window);

//excel
;(function($, window, undefined){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
             excel: function(self){
                 
                 if((self.options.actions.excelAction != undefined) && (self.options.permits.excel_grid)){
                       var form = $('<form action="' + self.options.actions.excelAction + '" method="POST" target="parent" ></form>').appendTo(self._$mainContainer);
                       var filtro = self._returnPostData();
                       filtro = JSON.stringify(filtro);
                       $('<input type="hidden" name="busqueda" />').val(filtro).appendTo(form);
                       form.submit();
                       form.remove();
                 }
            }
      })
      
})(jQuery, window);


;(function($, window){
      
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
            _divPivot:{},
            _tablePivot:{},
            _tbodyPivot:{},
            _$divStatusPivot:{},
            
            _aPivotColumn: [],
            _aPivotCData: [],
            _indiceBusqueda: 0,
            _indiceData:0,
            _aSqlPivot : false,
            
            _$field1:{},
            _$field2:{},
            _$field3:{},
            
            /**
             * Funcion que muestra el dialog 
             */
            _createDivPivot:function(field){
                  var self = this;
                  var divPivot = $('<div></div>').addClass('catalogo-table-pivot').appendTo(self._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'FILTER BUILDER',
                        width:800,
                        height:500,
                        buttons: [{
                              text: 'Cancelar',
                              click: function () { 
                                    $(this).dialog('close');
                              }
                        },{
                              text: 'Apply',
                              click: function () {
                                    
                                    if(self.onFormSearchSubmitting() != false){
                                          self._pivotBottonOk();
                                          $(this).dialog('close');
                                    }
                                    
                              }
                        }],
                        close: function(){
                              self._initializePivot();
                        }
                  });
                  self._divPivot = divPivot;
                  self._createUlMain(field);
                  divPivot.click(function(){
                        self._removeMenu();
                  });
            },
            
            // se encarga de ejecutar el pivot
            _pivotBottonOk: function(){
                  var self = this;
                  self._createJsonPivot();
                  self.load({
                        order: self._order,
                        limit: self._limit,
                        campo: self._campo,
                        offset:0,
                        sql: self._aSqlPivot
                  });
                  self._initializePivot();
            },
            
            // seteamos los valores del pivot
            _initializePivot: function(){
                  this._aPivotColumn = [];
                  this._aPivotCData = [];
                  this._indiceBusqueda = 0;
                  this._indiceData = 0
            },
            
            // se encarga de crear el array con los datos para realizar la busqueda
            _createJsonPivot: function(){
                  var aColumns = this._aPivotColumn;
                  var aData = this._aPivotCData;
                  var temp = {}
                  var newJson = [];
                  for(var i=0; i <= aColumns.length - 1; i++){
                        if((aData[i] != undefined) && (aData[i].length > 0)){
                              if(aColumns[i] != '' && aData[i] != ''){
                                    temp[aColumns[i]] = aData[i];
                                    newJson.push(temp);
                                    temp = {};
                              }
                        }
                  }
                  newJson.reverse();
                  this._aSqlPivot = newJson;
            },
            
            _createStatusPivot: function(){
                  var self = this;
                  if(self._aSqlPivot){
                        var sConsulta = '';
                        var spanPaginate = $('<span></span>').appendTo(this._$divBoxFooter);
                        // generamos el string de la consulta a buscar en el pivot para mostrarla al usuario en la parte inferior del grid
                        // en el paginado
                        $.each(self._aSqlPivot, function(index, value){
                              $.each(value, function(i, val){
                                    sConsulta += ' [' + val[3] + '] ' + (self._createStatusPivotBsc(val[1])) + ' ' + val[2] + ' ';
                              });
                        });
                        // agregamos la consulta en el paginado
                        spanPaginate.text(sConsulta);
                        // colomamos un boton para quitar la busqueda y carge los datos del grid normales
                        $('<a href="#">x</a>').appendTo(spanPaginate).click(function(e){
                              e.preventDefault();
                              self._aSqlPivot = false;
                              self.load();
                        });
                        self._$divStatusPivot = spanPaginate;
                  }                  
            },
            
            // funcion que utilizamos para concatenar que tipo de busqueda se realizara con el pivot, es esado en el string
            _createStatusPivotBsc: function(sentencia){
                  var s = '';
                  switch (sentencia) {
                        case 'Equals':
                              s = '=';
                              break;
                        case 'Does not equal':
                              s = '<>';
                              break;
                        case 'Is greater than':
                              s = '>';
                              break;
                        case 'Is greater than or equal to':
                              s = '>=';
                              break;
                        case 'Is less than':
                              s = '>';
                              break;
                        case 'Is less than or equal to':
                              s = '>=';
                              break;
                        case 'Is between':
                              s = '=';// dos cantidades con un and
                              break;
                        case 'Is not between':
                              s = '='; // dos cantidades con un and pero diferente
                              break;
//                        case 'Is blank':
//                              s = '=';
//                              break;
//                        case 'Is not blank':
//                              s = '=';
//                              break;
//                        case 'Is any of':
//                              s = '=';
//                              break;
//                        case 'Is none of':
//                              s = '=';
//                              break;
                        default:
                              s = '=';
                              break;
                  }
                  
                  return s;
            },
            
            /**
             * Funcion que se encarga de crear el cuerpo principal del pivot utilizando el plugin
             * dialog de jquery ui, coloca por defalut la condicion AND para partir de ahi en la busqueda
             */
            _createUlMain: function(field){
                  var self = this;
                  //creamos el menu principal
                  var aCondicion = $('<a></a>').addClass('btn btn-primary').attr('data-indicecondicion', self._indiceBusqueda).text('FILTRAR').css({color:'white'}).appendTo(self._divPivot);
                  $('<span class="caret"></span>').appendTo(aCondicion);
                  //desplegamos el menu 
                  aCondicion.click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        var position = $(this).position();
                        self._removeMenu();
                        self._clickCondicion(position, $(this), field);
                  });
                  
                  //creamos un formulario que contendra los campos de busqueda para que se pueda utilizar el validationEngine
                  var idContainer = self._$mainContainer.attr('id');
                  var formSearch = $('<form></form>').attr('id', 'formSearch-' + idContainer).attr('name', 'formSearch-'+ idContainer).appendTo(self._divPivot);
                  
                  //creamos la estructura de la tabla
                  var table = $('<table></table>').addClass('catalogo-table catalogo-table-striped catalogo-table-bordered table-hover').css('margin-top', '20px').appendTo(formSearch);
                  var tbody = $('<tbody></tbody>').appendTo(table); 
                  var tr = $('<tr></tr>').appendTo(tbody);
                  
                  $('<th></th>').text('Condicion').css({width:'50px'}).appendTo(tr);
                  $('<th></th>').text('Campo').css({width:'50px'}).appendTo(tr);
                  $('<th></th>').text('Filtro').css({width:'50px'}).appendTo(tr);
                  $('<th></th>').text('Valor').css({width:'50px'}).appendTo(tr);
                  $('<th></th>').text('').css({width:'50px'}).appendTo(tr);
                  
                  //guardamos los variables dentro del objeto
                  self._tablePivot = table;
                  self._tbodyPivot = tbody;
                  self._$formSearch = formSearch;
                  //creamos el primer elemento abuscar con el nombre del campo de la columna 
                  self._createElementAnd(field);
            },
            
            _createElementAnd: function(field){
                  var self = this;
                  self._aPivotColumn.push('And'); 
                  //creamos un array que contendra los valores de la busqueda
                  var arrayAnd = [field.pivot_title, 'Equals', '', field.title];
                  
                  //validamos si si se ha declaro este array en nuestro objeto 
                  if(typeof self._aPivotCData[self._indiceData] === 'undefined'){
                        self._aPivotCData[self._indiceData] = [];
                  }
 
                  // se crea el row y los td de la busqueda and
                  var tr = $('<tr></tr>').appendTo(self._tbodyPivot);
                  var tdCondicion = $('<td></td>').appendTo(tr);
                  var tdCampo = $('<td></td>').appendTo(tr);
                  var tdFiltro = $('<td></td>').appendTo(tr);
                  var tdValor = $('<td></td>').appendTo(tr);
                  var tdEliminar = $('<td></td>').appendTo(tr);
                  
                 // colocamos el nombre de la condicion 
                  var aCondicion = $('<a></a>').text('And').attr('data-indicebusqueda', self._indiceBusqueda).appendTo(tdCondicion);
                  
                  // colocamos el nombre del campo
                  var aCampo = $('<a></a>').text(field.title).attr('data-validators', field.validators).attr('data-indicebusqueda', self._indiceBusqueda).attr('data-indicedata', self._indiceData).appendTo(tdCampo);
                  
                  // filtro por default en una condicion and es equals
                  var aFiltro = $('<a></a>').text("Equals").attr('data-indicebusqueda', self._indiceBusqueda).attr('data-indicedata', self._indiceData).appendTo(tdFiltro);
                  
                  //colocamos el input que contendra el valor a buscar
//                  var aInput = $('<input type="text" />').appendTo(tdValor);
                  
                  var aInputOptions = {
                        type:'text',
                        validators: field.validators,
                        events:{
                              change:function(){
                                    var value = $(this).val();
                                    if(value == ""){
                                          return;
                                    }
                                    arrayAnd[2] = value;
                              }
                        }
                  };
                  var aInput = self._createInputForRecordField(aInputOptions, 'fieldSearch', undefined, undefined);
                  aInput.appendTo(tdValor);
                  
                  // link para eliminar registro a buscar
                  var aEliminar = $('<a></a>').text("Eliminar").attr('data-indicebusqueda', self._indiceBusqueda).attr('data-indicedata', self._indiceData).appendTo(tdEliminar);
                  
                  //mandamos llamar al menu para las condiciones
                  aCondicion.click(function(e){
//                        e.preventDefault();
//                        e.stopPropagation();
//                        
//                        var position = $(this).position();
//                        
//                        self._removeMenu();
//                        self._clickCondicion(position, $(this));
                  });
                  
                  //mandamos llamar el menu para los campos
                  aCampo.click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        
                        var position = $(this).position();
                        
                        self._removeMenu();
                        self._clickCampo(position, $(this));
                  });
                  
                  //manda llamar menu de filtros
                  aFiltro.click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        
                        var position = $(this).position();
                        
                        self._removeMenu();
                        self._clickFiltro(position, $(this));
                  });
                  
                  //para guardar el valor del input
//                  self._$field1.change(function(){
//                        
//                        var value = $(this).val();
//                        
//                        if(value == ""){
//                              return;
//                        }
//                        
//                        arrayAnd[2] = value;
//                  });
                  
                  //Elimina el row
                  aEliminar.click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        var indiceBusqueda = $(this).attr('data-indicebusqueda');
                        var indiceData = $(this).attr('data-indicedata');
                        self._aPivotCData[indiceData] = '';
                        tr.remove();
                  });
                  
                  //agregamos la busqueda en el objeto que contendra todos los datos
                  self._aPivotCData[self._indiceData] = arrayAnd;
                  
                  //iniciamos proceso de validaciones
                  self.onFormSearchClosed();
                  self.onFormSearchCreated();
            },
            
            //funcion que quita todos los menus desplegables
            _removeMenu:function(){
              
              this._divPivot.find('.dropdown-menu').remove();
            },
            
            //menu que muestra el plugin al dar click al link de condiciones del filtro
            _clickCondicion:function(position, item, field){

                  var self = this;
                  var ul = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>').css({
                        top:position.top + 20, 
                        left:position.left,
                        display:'block'
                        }).appendTo(self._divPivot);
                        
                     // esta parte se comento para verificar como poner los demas filtros en or not and,
                     // hasta el momento solo se tiene soporte para los and
                  
//                  $('<li><a tabindex="-1" href="#">And</a></li>').attr('data-indicecondicion', self._indice).appendTo(ul).click(function(e){
//                       e.preventDefault();
//                       self._cambiarCondicion('And', item);
//                  });
//                  
//                  $('<li><a tabindex="-1" href="#">Or</a></li>').appendTo(ul).click(function(e){
//                       e.preventDefault();
//                       self._cambiarCondicion('Or', item);
//                  });
//                  
//                  $('<li><a tabindex="-1" href="#">Not And</a></li>').appendTo(ul).click(function(e){
//                       e.preventDefault();
//                       self._cambiarCondicion('Not And', item);
//                  });
//                  
//                  $('<li><a tabindex="-1" href="#">Not Or</a></li>').appendTo(ul).click(function(e){
//                       e.preventDefault();
//                       self._cambiarCondicion('Not Or', item);
//                  });
//                  
//                  $('<li class="divider"></li>').appendTo(ul);
                 
                  $('<li><a tabindex="-1" href="#">Add Condition</a></li>').appendTo(ul).click(function(e){
                        self._indiceData++;
                        self._createElementAnd(field);
                  });
                  
//                  $('<li><a tabindex="-1" href="#">Add Group</a></li>').appendTo(ul).click(function(e){
//                        
//                  });
//                  
//                  $('<li><a tabindex="-1" href="#">Clear</a></li>').appendTo(ul).click(function(e){
//                        
//                  });
//                  
//                  $('<li><a tabindex="-1" href="#">Clear All</a></li>').appendTo(ul).click(function(e){
//                        
//                  });
            },
            
            //muestra el menu de las columnas del grid para cambiar la columna a buscar
            _clickCampo:function(position, item){
                  var self = this;
                  var ul = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>').css({
                        top:position.top + 20, 
                        left:position.left,
                        display:'block'
                        }).appendTo(self._divPivot);
                        
                  var indiceBusqueda = item.attr('data-indicebusqueda');
                  var indiceData = item.attr('data-indicedata');   
                  
                  //recorremos las columnas que el usuario ingreso para crear el menu desplegable que dira que columna buscar
                  $.each(self.options.fields, function(keyColumna, valorColumna){
                        //validamos que no se incluya la columna de acciones
                        if(valorColumna.title != 'Acciones'){
                              li = $('<li></li>').appendTo(ul);
                              $('<a tabindex="-1" ></a>').text(valorColumna.title).appendTo(li).click(function(){
                                    //cambiamos el nombre de la columna a buscar
                                    item.text(valorColumna.title);
                                    item.removeAttr('data-validators');
//                                    item.removeAttr('data-title-pivot');
//                                    item.removeAttr('data-title');
                                    item.attr('data-validators', valorColumna.validators);
//                                    item.attr('data-title-pivot', valorColumna.pivot_title);
//                                    item.attr('data-title', valorColumna.title);
                                    // guardamos los datos en un array temporal
                                    self._aPivotCData[indiceData][0] = valorColumna.pivot_title;
                                    self._aPivotCData[indiceData][3] = valorColumna.title;
                                    // cambiamos las validaciones respecto al nuevo campo a validar
                                    var input = item.parent().parent().find('td').eq(3).find('input');
                                    input.removeAttr('class');
                                    input.addClass(valorColumna.validators);
                                    self.onFormSearchClosed();
                                    self.onFormSearchCreated();
                              });
                        }
                  });
            },
            
            //muestra el menu de los filtros
            _clickFiltro: function(position, item){
                  var self = this;
                  var ul = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>').css({
                        top:position.top + 20, 
                        left:position.left,
                        display:'block'
                        }).appendTo(self._divPivot);
                  
                  $('<li><a tabindex="-1" href="#">Equals</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item,'Equals');
                        self._cambiarFiltro('Equals',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Does not equal</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Does not equal');
                        self._cambiarFiltro('Does not equal',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is greater than</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is greater than');
                        self._cambiarFiltro('Is greater than',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is greater than or equal to</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is greater than or equal to');
                        self._cambiarFiltro('Is greater than or equal to',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is less than</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is less than');
                        self._cambiarFiltro('Is less than',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is less than or equal to</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is less than or equal to');
                        self._cambiarFiltro('Is less than or equal to',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is between</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is between');
                        self._cambiarFiltro('Is between',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is not between</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is not between');
                        self._cambiarFiltro('Is not between',item);
                  });
                  
                  // se comento para no mostrar en ele menu checar mas adelante como seria
                  
//                  $('<li><a tabindex="-1" href="#">Is any of</a></li>').appendTo(ul).click(function(e){
//                        e.preventDefault();
//                        self._createInputBusqueda(item, "Is none of", td);
//                        self._cambiarFiltro('Is any of',item);
//                  });
//                  
//                  $('<li><a tabindex="-1" href="#">Is none of</a></li>').appendTo(ul).click(function(e){
//                        e.preventDefault();
//                        self._createInputBusqueda(item, "Is none of", td);
//                        self._cambiarFiltro('Is none of',item);
//                  });
            },
            
            //metodo que se encarga de guardar la condicion de la busqueda and, or, not and etc ...
            _cambiarCondicion: function(title, item){
                  var self = this;
                  var indiceBusqueda = item.attr('data-indicebusqueda');
                  item.text(title);
                  self._aPivotColumn[indiceBusqueda] = title;
            },
            
            _cambiarFiltro:function(title, item){
                  var self = this;
                  var indiceBusqueda = item.attr('data-indicebusqueda');
                  var indiceData = item.attr('data-indicedata');
                  item.text(title);
                  self._aPivotCData[indiceData][1] = title;
            },
            
            _createInputBusqueda: function(item, title){
                  var self = this;
                  var indiceBusqueda = item.attr('data-indicebusqueda');
                  var indiceData = item.attr('data-indicedata');
                  //recuperamos el td donde se colocara el input
                  var td = item.parent().parent().find('td').eq(3);
                  // recuperamos los validadores que agregamos en el link de la columna dos del campo ejemplo "nombre, descripcion, created ..etc"
                  var validators = item.parent().parent().find('td').eq(1).find("a").attr('data-validators');
                  // recuperamos el titulo que sele asigno para el pivot
//                  var title_pivot = item.parent().parent().find('td').eq(1).find('a').attr('data-title-pivot'); 
//                  // recuperamos el nombre para mostrar que tiene esta columna
//                  var nombre = item.parent().parent().find('td').eq(1).find('a').attr('data-title'); 
                  // limpiamos el td para ingresar el nuevo input
                  td.empty();
                  
                  // validamos si es between o is not between colocaremos dos inputs en vez de uno
                  if(title == 'Is between' || title == 'Is not between'){
                        var aInputOptions1 = {
                              type:'text',
                              validators: validators,
                              events:{
                                    change:function(){
                                          var val = $(this).val();
                                          var val2 = inputValor1.val();
                                          self._aPivotCData[indiceData][2] = val+'='+val2;
                                    }
                              }
                        };
                        var aInputOptions2 = {
                              type:'text',
                              validators: validators,
                              events:{
                                    change:function(){
                                          var val2 = $(this).val();
                                          var val = inputValor2.val();
                                          self._aPivotCData[indiceData][2] = val+'='+val2;
                                    }
                              }
                        };
                        var inputValor1 = self._createInputForRecordField(aInputOptions1, 'fieldSearch', undefined, undefined);
                        var inputValor2 = self._createInputForRecordField(aInputOptions2, 'fieldSearch', undefined, undefined);
                        inputValor1.appendTo(td);
                        inputValor2.appendTo(td);
                  }  else {
                        var aInputOptions = {
                              type:'text',
                              validators: validators,
                              events:{
                                    change:function(){
                                          var value = $(this).val();
                                          if(value == ""){
                                                return;
                                          }
                                          self._aPivotCData[indiceData][2] = value;
                                    }
                              }
                        };
                        var input = self._createInputForRecordField(aInputOptions, 'fieldSearch', undefined, undefined);
                        input.appendTo(td);
                        self._aPivotCData[indiceData][1] = title;
                  }
            }
            
      });
      
})(jQuery, window);

/**
 * Clase que contendra los metdos necesarios para crear los formularios del grid
 */
;(function($, window, undefined){
      
      //extendemos del plugin catalogoTable
      $.extend(true, $.hik.jcatalogTable.prototype, {
            
            /**
             * Metodo privado que se encargara de crear los input-text 
             */
            _createInputForRecordField: function(field, fieldName, value, id){
                  // validamos si el query arrojo un valor para este elemento
                  value = (typeof value != 'undefined') ? value : '';
                  
                  // validamos si el usuario agrego un valor por default para el input
                  if((value == '') && (typeof field.default_value !='undefined')){
                        
                        value = field.default_value;
                  }
                  
                  if(field.type == 'text'){
                        
                      return this._createInputText(field, fieldName, value, id);
                  }
                  
                  if(field.type == 'hidden'){
                        
                      return this._createInputHidden(field, fieldName, value, id);
                  }
                  
                  if(field.type == 'date'){
                        
                      return this._createInputDate(field, fieldName, value, id);
                  }
                  
                  if(field.type == 'autocomplete'){
                      
                      return this._createInputAutocomplete(field, fieldName, value, id);
                  }
                  
                  if(field.type == 'textarea'){
                        
                      return this._createTextarea(field, fieldName, value, id);
                  }
                  
                  if(field.type == 'checkbox'){
                        
                      return this._createInputCheckbox();
                  }
                  
                  if(field.type == 'radiobutton'){
                        
                       return this._createInputRadioButton();
                  }
                  
                  if(field.type == 'select'){
                        
                      return this._createSelect(field, fieldName, value);
                  }
                  
                  if(field.type == 'link'){
                      
                      return this._createLink(field, fieldName, value);
                  }
            },
            
            /**
             * funcion que se encarga de crear el campo input tipo texto
             */
            _createInputText: function(field, fieldName, value, id){
                  //creamos el elemento input
                  var input = $('<input ' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + fieldName + ' " '+ (id != undefined ? 'data-id="'+ id +'"' : '' ) +' type="text"' + (value != undefined ? 'value="' + value + '"' : '') + 'name="' + fieldName + '" />');
                  //validamos si este input tendra eventos asociados
                  if(field.events != undefined){
                        $.each(field.events, function(indexEvent, fnEvent){
                              input.on(indexEvent, fnEvent);
                        });
                  }
                  // validamos si este input contendra validaciones
                  if(field.validators != undefined){
                        input.addClass(field.validators);
                  }
                  
                  return input;
            },
            
            /**
             * funcion que se encarga de crear el campo input tipo hidden
             */
            _createInputHidden: function(field, fieldName, value, id){
                  var input = $('<input ' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' '+ (id != undefined ? 'data-id="' + id + '"' : '') +' id="' + fieldName + '" type="hidden"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '" />');
                  if(field.inputClass != undefined){
                        input.addClass(field.inputClass);
                  }
                  // validamos si este input contendra validaciones
                  if(field.validators != undefined){
                        input.addClass(field.validators);
                  }
                  
                  return input;
            },
            
            /**
             * funcion que se encarga de crear el campo de input de texto con la configuracion de datepicker del plugin de jquery ui
             */
            _createInputDate: function(field, fieldName, value, id){
                  var displayFormat = field.displayFormat || this.options.defaultDateFormat;
                  var input = $('<input ' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + fieldName + '" type="text"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '" '+ (id != undefined ? 'data-id="' + id + '"' : '') +' />');

                  input.datepicker({ dateFormat: displayFormat});
                  if(typeof field.events != 'undefined'){
                        $.each(field.events, function(indexEvent, fnEvent){
                              input.on(indexEvent, fnEvent);
                        });
                  }
                  
                   // validamos si este input contendra validaciones
                  if(field.validators != undefined){
                        input.addClass(field.validators);
                  }
                  
                  return input;
            },
            
            /**
             *
             */
            _createInputAutocomplete: function(field, fieldName, value, id){
                  var source = [];
                  var input = $('<input "' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + fieldName + '" type="text"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '" '+ (id != undefined ? 'data-id="' + id + '"' : '') +'/>');
                  
                  source = this._getOptionsWithCaching(fieldName);
                  
                  input.autocomplete({
                        source: source
                  });
                  
                  // validamos si este input contendra validaciones
                  if(field.validators != undefined){
                        input.addClass(field.validators);
                  }
                  
                  return input;
            },
            
            /**
             * funcion que se encarga de crear en campo textarea 
             */
            _createTextarea: function(field, fieldName, value, id){
                  var textarea = $('<textarea class="' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + '" id="' + fieldName + '" name="' + fieldName + '" '+ (id != undefined ? 'data-id="' + id + '"' : '') +'>' + (value || '') + '</textarea>');
                  if(typeof field.events != 'undefined'){
                        $.each(field.events, function(indexEvent, fnEvent){
                              textarea.on(indexEvent, fnEvent);
                        });
                  }
                  
                  // validamos si este input contendra validaciones
                  if(field.validators != undefined){
                        textarea.addClass(field.validators);
                  }
                  
                  return textarea;
            },
            
            _createSelect: function(field, fieldName, value, id){
                  //Create select element
                  var select = $('<select class="' + field.inputClass + '" id="' + fieldName + '" name="' + fieldName + '" '+ (id != undefined ? 'data-id="' + id + '"' : '') +'></select>');

                  //add options
                  var options = this._getOptionsWithCaching(fieldName);
                  $.each(options, function (propName, propValue) {
                        select.append('<option value="' + propName + '"' + (propName == value ? ' selected="selected"' : '') + '>' + propValue + '</option>');
                  });
                  
                  select.attr({
                        'value' : value
                  })
                  
                  if(typeof field.events != 'undefined'){
                        $.each(field.events, function(indexEvent, fnEvent){
                              select.on(indexEvent, fnEvent);
                        });
                  }
                  
                  // validamos si este input contendra validaciones
                  if(field.validators != undefined){
                        select.addClass(field.validators);
                  }

                  return select;
            },
            
            _createLink: function(field, fieldName, value, id){
                  var link = $('<a '+(id != undefined ? 'data-id="'+ id +'"' : '')+'></a>').text(value);
                  if(typeof field.events != 'undefined'){
                        $.each(field.events, function(indexEvent, fnEvent){           
                              link.on(indexEvent, fnEvent);
                        });
                  }
                  return link;
            },
            
            _getOptionsWithCaching:function(fieldName){
                  // validamos si ya se encuentran cargados los datos del combo
                  if(typeof this._cache[fieldName] == 'undefined'){

                        var optionsSource = this.options.columns[fieldName].source;
                        
                        if(typeof optionsSource == 'string'){
                              
                             // validamos optionsSource es un string quiere decir que es una url donde se traeran los datos del cobo
                             this._cache[fieldName] = this._getOptionsAjaxCall(optionsSource);
                             
                        } else if(jQuery.isArray(optionsSource)){
                              
                             //si es un array se prepara de tal manera que pueda tener un indice y un valor 
                             this._cache[fieldName] = this._buildOptionsFromArray(optionsSource);
                              
                        } else {
                             
                             //de lo contrario quiere decir que optionsSource ya esta preparado
                             this._cache[fieldName] = optionsSource;
                        }
                  }
                  
                  return this._cache[fieldName];
            },
            
            _getOptionsAjaxCall: function(url, postData){
                  
                 postData = (typeof postData != "undefined") ? postData : '';
                 
                 var self = this;
                 var options = {};
                 
                 $.ajax({
                        url: url,
                        type:'POST',
                        async: false,
                        data: postData,
                        dataType:'json',
                        success: function(data){ 
                              
                              if(data.success){
                                    options = data.data;
                              }
                        },
                        error: function(){
                              
                              var div = $('<div></div>').attr('id', 'catalogo-dialog-msg').appendTo(this._$mainContainer);
                              div.dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: self.options.messages.cannotLoadOptionsFor,
                                    buttons: [{
                                          text: self.options.messages.btnClose,
                                          click: function () {
                                                $(this).dialog('close');
                                          }
                                    }]
                              });
                        }
                  });
                  
                  return options;
            },
            
            /**
             * Funcion que se encarga de crear un objeto json en base al array que el usuario ingreso
             */
            _buildOptionsFromArray: function (optionsArray) {
                  
                  var options = {};

                  for (var i = 0; i < optionsArray.length; i++) {
                        options[optionsArray[i]] = optionsArray[i];
                  }

                  return options;
            }
            
      });
      
})(jQuery, window);