;(function($, window, undefined){
      
      $.widget("hik.catalogoTable5", {
            
            // Opciones predeterminadas del plugin 
            options: {
                  
                  title : '',
                  load_url: '',
                  paginate:{
                        order: 'DESC',
                        campo: 'id',
                        limit: 15,
                        offset: 0
                  },
                  defaultDateFormat: 'yy-mm-dd',
                  columns: {},
                  buttons: {},
                  actions_row:{},
                  messages: {
                        msgServerCommunicationError: 'A ocurrido un error al comunicarse con el servidor.',
                        msgNoDataAvailable: 'Datos no disponibles!',
                        cannotLoadOptionsFor: 'No se puede cargar los registros {0}',
                        titleError: 'Error',
                        titleWarning: 'Atencion!',
                        btnClose: 'Cerrar',
                        btnSave: 'Guardar',
                        btnCancel: 'Cancelar'
                  }
            },
            
            _$mainContainer: {},
            _$divBox: {},
            _$divBoxHeader:{},
            _$table: {},
            _$tableBody: {},
            _$divBoxFooter: {},
            _$spanPaginate:{},
            _$ulPaginate:{},
            
            _aColumns: null,
            _aDataLoad: null,
            _totalRows: null,
            _totalRowsSearch: null,
            _pagHasta:null,
            _paginaActual: null,

            _order: null,
            _limit: null,
            _offset: null,
            _campo: null,
            _querySuccess:null,
            _pagTotal:null,
            
            _cache:null,
            _postData: null,
            
            /**
             * Funcion que se encarfa de inicializar las variables y objetos que seran utulizados 
             * posteriormente en el plugin 
             */
            _initialize: function(){
                  
                  this._$mainContainer = this.element;
                  this._aColumns = [];
                  this._aDataLoad = [];
                  this._totalRows = 0;
                  this._totalRowsSearch = 0;
                  this._order = this.options.paginate.order;
                  this._limit = this.options.paginate.limit;
                  this._offset = this.options.paginate.offset;
                  this._campo = this.options.paginate.campo;
                  this._paginaActual = 1;
                  this._querySuccess = false;
                  this._pagTotal = 1;
                  this._cache = [];
                  this._postData = {};
            },
            
            /**
             * comienza la parte de inizializar variables y carga de datos
             * Funcion que se encarga de cargar las columnas en un array y hacer la peticion ajax para traer los datos
             * del servidor
             */
            _loadConfig: function(){
                  
                  this._loadColumns();
                  this._loadData();
            },
            
            /**
             * Funcion que se encarga de guardaer en un array los nombres de las columnas que ingreso el usuario 
             */
            _loadColumns: function(){
                  
                  var self = this;
                  
                  if(self.options.columns != null){
                        
                        $.each(self.options.columns, function(k){
                              self._aColumns.push(k);
                        }); 
                        
                  } else {
                        return;
                  }
            },
            
            _loadPostData: function(postData){
                  
                  var self = this;
                  var data = {
                        order: self._order,
                        limit: self._limit,
                        offset: self._offset,
                        campo: self._campo,
                        sql: self._aSqlPivot
                  };
                  postData = (typeof postData == 'undefined') ? data : postData;
                  
                  self._postData = {
                        order: self._order,
                        campo: self._campo,
                        sql: self._aSqlPivot
                  };
                  
                  return postData;
            },
            
            /**
             * Funcion que se encarga de cargar los datos al entrar a catalogo por primera vez
             */
            _loadData: function(data){
                  
                  var self = this;
                  
                  //creamos un objeto con valores del paginado que tendra el query
                  var postData = self._loadPostData(data);
                  
                  $.ajax({
                        url: self.options.load_url,
                        type:'POST',
                        async: false,
                        data: postData,
                        dataType:'json',
                        success: function(data){ 
                              
                              self._loadDataSuccess(data);
                        },
                        error: function(){
                              
                              self._loadDataError();
                        }
                  });
                  
            },
            
            /**
             * Funcion que se encarga de validar la consulta trae resultados si es asi guarda en unas variables 
             * los datos que arrojo el query y el total de rows que se produjo, si no trae resultados el query
             * se muestra un dialog.
             */
            _loadDataSuccess: function(data){
                  
                  var self = this;
                  var request = data; 
                  
                  if((request.total_rows === undefined) && (parseInt(request.total_rows) === 0)){
                        
                        var div = $('<div></div>').attr('id', 'catalogo-dialog-msg').appendTo(this._$mainContainer);
                        
                        div.text(self.options.messages.msgNoDataAvailable).dialog({
                              autoOpen: true,
                              modal: true,
                              title: self.options.messages.titleWarning,
                              buttons: [{
                                    text: self.options.messages.btnClose,
                                    click: function () {
                                          div.dialog('close');
                                          div.remove();
                                    }
                              }]
                        });
                  }
                  
                  this._querySuccess = request.success;
                  this._aDataLoad = request.data;
                  this._totalRows = (typeof request.total_rows != 'undefined') ? request.total_rows : 0;
                  this._totalRowsSearch = (typeof request.total_rows_search != 'undefined') ? request.total_rows_search : 0;
            },
            
            /**
             * Funcion que se encarga de mostrar un mensaje de error en caso de que la peticion ajax para cargar los datos falla
             */
            _loadDataError: function(){
                  
                  var self = this;
                  var div = $('<div></div>').attr('id', 'catalogo-dialog-msg').appendTo(this._$mainContainer);
                  
                  div.text(self.options.messages.msgServerCommunicationError).dialog({
                        autoOpen: true,
                        modal: true,
                        title: self.options.messages.titleError,
                        buttons: [{
                              text: self.options.messages.btnClose,
                              click: function () {
                                    div.dialog('close');
                                    div.remove();
                              }
                        }]
                  });
            },
            
            /**
             * @name _create
             * @description Funcion que se encarga de crear la tabla del plugin
             */
            _create: function(){
                  
                  this._construct();
                  this._createGrid();
            }, 
            
            /**
             * @name _construct
             * @description 
             */
            _construct: function(){
                  
                  this._initialize();
                  this._loadConfig();
            },
            
            /**
             * @name _createGrid
             * @description
             */
            _createGrid: function(){
                  
                  this._createContainerGrid();
                  this._createTitleGrid();
                  this._createButtonsGrid();
                  this._createTable();
                  this._createTableHead();
                  this._createTableTbody();
                  this._createTableFoot();
                  this._textPaginate();
                  this._createStatusPivot();
            },
            
            
            /**
             *comienza la parte donde crea la table y el header 
             */
            _createContainerGrid: function(){
                        
                  var containerTable = $('<div></div>').addClass('row-fluid').appendTo(this._$mainContainer);
                  var containerSpan = $('<div></div>').addClass('span12').appendTo(containerTable);
                  var divBox = $('<div></div>').addClass('box').appendTo(containerSpan);
                  var divBoxHeader = $('<div></div>').addClass('box-info-table box-head tabs').appendTo(divBox);
                        
                  this._$divBox = divBox;
                  this._$divBoxHeader = divBoxHeader;
            },
            
            _createTitleGrid: function(){
                  
                  //validamos si el usuario ingreso una configuracion para el nombre que tendra la tabla, si no 
                  // interrumpimos el proceso
                  if(this.options.title == ''){
                        return;
                  }
                   
                  //creamos una etiqueta html h3 que contendra el titulo de la tabla en el grid
                  $('<h3></h3>').appendTo(this._$divBoxHeader).text(this.options.title);
            },
            
            _createButtonsGrid: function(){
                  
                  var self = this;
                  
                  //validamos si el usuario ingreso la configuracion para crear botones, sino interrumpimos el proceso
                  if(self.options.buttons == null){
                        
                        return;
                  }
                  
                  // creamos el ul que contendra los botones
                  var contButtons = $('<ul><ul>').addClass('nav nav-tabs').appendTo(this._$divBoxHeader);
                  
                  //recorremos los botones que creo el usuario
                  $.each(self.options.buttons, function(keyButtons, buttons){
                        
                        //validamos si tiene permisos para agregar el boton
                        if(buttons.permit){
                              
                              //creamos el boton
                              self._createOptionButton(contButtons, buttons);
                        }
                  });
            },
            
            _createOptionButton: function(contButtons, button){
                  
                  var self = this
                  var li = $('<li></li>').appendTo(contButtons);   
                  
                  $('<a></a>')
                        .text(button.title).attr('id', button.title)
                        .attr('href', '#').attr('data-toggle', 'tab')
                        .appendTo(li).click(function(e){
                              
                              e.preventDefault();
                              button.fn($(this), self);
                        });
            },
            
            _createTable: function(){
                  
                  var divBoxNoMargin = $('<div></div>')
                        .addClass('box-content box-nomargen').appendTo(this._$divBox);
                  var table = $('<table></table>')
                                    .addClass('catalogo-table catalogo-table-striped catalogo-table-bordered table-hover')
                                    .appendTo(divBoxNoMargin);
                  
                  this._$table = table;
            },
            
            _createTableHead: function(){

                  if(this.options.columns != null){
                              
                        var thead = $('<thead></thead>').appendTo(this._$table);
                        var ttr = this._createTableTr(thead);
                        
                        for(var i = 0; i < this._aColumns.length; i++){
                              
                              var columnTitle = this._aColumns[i];
                              this._createTableTh(this.options.columns[columnTitle], columnTitle,ttr);
                        }
                  }
            },
            
            _createTableTr: function(item, prepend){    
                  
                  if(typeof prepend != 'undefined' && prepend){
                        return $('<tr></tr>').prependTo(item);
                  } else {
                        return $('<tr></tr>').appendTo(item);
                  }
            },
            
            _createTableTh: function(field, columnTitle, ttr){
                  
                  var self = this;
                  var tth = $('<th></th>').attr('width', field.width).text(field.title).appendTo(ttr);
                
                  if(field.sortable){
                       
                        $('<span></span>').addClass("icon-arrow-down").appendTo(tth).click(function(){
                              self._campo = columnTitle;
                              self._order = (self._order == 'ASC') ? 'DESC' : 'ASC';
                              self.load();
                        });
                  }
                 
                  if(field.pivot){
                       
                        $('<span></span>').addClass('icon-search').appendTo(tth).click(function(){
                             
                              self._createDivPivot(field);
                        });
                  }
                        
            },

            
            ///////////////////////////////////////////////////////////////////
            // INICIAN METODOS PARA CREAR EL BODY Y ROWS QUE TENDRA EL GRID 
            //////////////////////////////////////////////////////////////////
            
            
            /**
             * comienza la parte donde crea el body de la tabla
             */
            _createTableTbody: function(){
                        
                  var self = this;
                  
                  //validamos si el usuario ingreso los nombres de las columnas que tendra el grid
                  if(self.options.columns != null){
                        
                        //guardamos el objeto body de la tabla
                        var tbody = $('<tbody></tbody>').appendTo(self._$table);
                        
                        //creamos las filas que tendra cada tabla
                        self._createTableRows(tbody);
                        
                        //guardamos en objeto del body en un objeto privado para poder manipularlo mas adelante
                        self._$tableBody = tbody;
                  }
            },
            
            /**
             * 
             */
            _createTableRows: function(tbody){
                  
                  var self = this;
                  
                  //validadmos si el query se realizo con exito
                  if(self._querySuccess){
                        
                        //cargamos los datos en la tabla
                        self._createTableRowsLoadData(tbody);
                  
                  } else {
                        
                        //mandamos un mensaje de error
                        self._createTableRowsError(tbody); 
                  }
            },
            
            _createTableRowsLoadData:function(tbody, data, prepend){
                  
                        var self = this;
                        var ttr = {};
                        var i = 0;
                        var loadData = (typeof data == 'undefined') ? self._aDataLoad : data;
                        
                        //recorremos los nombres de las columnas que tendra el grid para cargar los datos del query
                        $.each(loadData, function(keyData, valueData){
                              
                              // creamos la fila en la tabla
                              ttr = self._createTableTr(tbody, prepend);
                              
                              // recorremos los datos arrojados del query
                              $.each(self._aColumns, function(keyColumns, valueColumns){
                                    
                                    // si el usuario coloco una columna de acciones creamos los botones para cada accion,
                                    // de lo contrario colocamos los datos del query en la columna correspondiente
                                    if(valueColumns === 'actions'){
                                          
                                          self._createTableRowsActions(ttr, valueData.id);
                                          
                                    } else {
                                          
                                          self._createTableRowsData(ttr, valueColumns, valueData.id, valueData[valueColumns], i);
                                    }
                              });
                              
                              i++;
                        });
            },
            
            _createTableRowsActions: function(ttr, id){
                  
                  var self = this;
                  var ttd = self._createTableTd(ttr);
                
                  //recorremos las acciones dadas de altas por el usuario para crear los botones correspondientes de cada accion
                  $.each(self.options.actions_row, function(keyAction, valueAction){
                        
                        //validamos si la accion cuenta con permisos para ser mostrado de acuerdo al rol del usuario y sus permisos
                        if(valueAction.permit){
                              
                              // creamos la accion
                              self._createTableTdAction(id, valueAction,ttd);
                        }
                  }); 
            },
            
            _createTableRowsData: function(ttr, fieldName, id, value, i){
                  
                  var self = this;
                  var td = {};
                  
                  value = (typeof value != "undefined") ? value : '';
                             
                  td = self._createTableTd(ttr);
                       
                  if(typeof self.options.columns[fieldName].type != "undefined"){
                             
                        var input = self._createInputForRecordField(fieldName, id, value, i);
                        input.appendTo(td);
                  } else {
                        td.text(value);
                  }            
            },
            
            _createTableRowsError: function(tbody){
                  var self = this;
                  var div = $('<div></div>').text(self.options.messages.msgNoDataAvailable).appendTo(self._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Atencion !',
                        buttons: [{
                              text: self.options.messages.btnClose,
                              click: function () {
                                    div.dialog('close');
                                    div.remove();
                              }
                        }]
                  });
                  var ttr = self._createTableTr(tbody);        
                  self._createTableTd(ttr);
            },
            
            _createTableTdAction: function(id, button, ttd){

                  var self = this;
                 
                  $('<a></a>')
                        .css({'margin-left':'5px','margin-bottom':'7px'})
                        .addClass("btn btn-primary btn-mini")
                        .text(button.title).attr('id', id)
                        .appendTo(ttd).click(function(e){
                              e.preventDefault();
                              button.fn(id, $(this), self);   
                        });
            },
            
            _createTableTd: function(ttr){
                  
                  return $('<td></td>').css('vertical-align', 'middle').appendTo(ttr);
            },
            
            
            /////////////////////////////////////////////////////////////////
            // INICIAN METODOS DEL PAGINADO
            ////////////////////////////////////////////////////////////////
            
            
            _createTableFoot: function(){
                  
                  var divBoxFooter = $('<div></div>').addClass('box-info-table box-footer').appendTo(this._$divBox);
                  
                  this._createTablePaginator(divBoxFooter);
                  this._createTablePages(divBoxFooter);
                  this._createSelectLimit(divBoxFooter);
                  this._$divBoxFooter = divBoxFooter;
            },
            
            _createTablePaginator: function(divBoxFooter){
                  
                  var divButtonsPaginator = $('<div style="float:right; margin: 0;"><div>')
                                          .addClass("pagination").appendTo(divBoxFooter);
                  var ul = $('<ul></ul>').appendTo(divButtonsPaginator);
                  
                  this._createTableButtonsPaginator(ul);
                  this._$ulPaginate = ul;
            },
            
            _createTablePages: function(divBoxFooter){
                        
                  var spanPaginate = $('<span></span>').appendTo(divBoxFooter);
                  
                  this._$spanPaginate = spanPaginate;
            },
            
            
            _createSelectLimit: function(divBoxFooter){
                  
                  if(this.options.paginate.cbox_pagination){
                        var i = 10;
                        var self = this;
                        var divContent = $('<div></div>').css({
                              'width':'150px', 
                              'margin':'0 auto'
                        }).appendTo(divBoxFooter);
                        var select = $('<select></select>').css({
                              'width':'100px', 
                              'margin':'0 auto'
                        }).appendTo(divContent);
                  
                        while(i <= 50){
                        
                              $('<option></option>').val(i).text(i).appendTo(select);
                              i +=10;
                        }
                  
                        $('<option></option>').val(100).text('100').appendTo(select);
                  
                        select.attr({
                              'value' : self._limit
                              })
                  
                        select.change(function(){
                              var val = $(this).val();
                              if(val != ''){
                                    self._limit = parseInt(val);   
                                    self.load();
                              }
                        });
                  }
            },
            
             _createTableButtonsPaginator: function(ul){
                  
                  //iniciamos variables a utilizar
                  var self = this;
                  var intervalo = 3;
                  var pagina = parseInt(self._paginaActual);
                  var pagDesde = parseInt(pagina) - parseInt(intervalo);
                  var pagHasta = parseInt(pagina) + parseInt(intervalo);
                  var totalPaginas = self._totalPaginas((self._aSqlPivot != false ? self._totalRowsSearch : self._totalRows), this._limit);
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
                  
                  this._offset = (parseInt(page) * parseInt(limit)) - parseInt(limit);
                  this._paginaActual = page;
                  
                  this.load();
                  
//                  this._$ulPaginate.empty();
//                  this._createTableButtonsPaginator(this._$ulPaginate);
            },
            
            _textPaginate: function(){
                  
                  this._$spanPaginate.text('Pagina ' + this._paginaActual + ' de '+ this._pagTotal +' Items Busqueda(' + this._totalRowsSearch + ') Total Items(' + this._totalRows +')');
            },
            
            //////////////////////////////////////////////////////
            //    METODOS PUBLICOS
            /////////////////////////////////////////////////////
            
            load: function (postData, completeCallback) {
                  
                  this.destroy();
                  this._loadData(postData);
                  this._createGrid(); 
                  
                  if(typeof completeCallback == 'function'){
                        completeCallback();
                  }
            },

            destroy: function () {
                  
                  this.element.empty();
                  $.Widget.prototype.destroy.call(this);
            },
            
            addrow: function (prepend, data, completeCallback){
                  
                  this._createTableRowsLoadData(this._$tableBody, data, prepend);
                  
                  if(typeof completeCallback == 'function'){
                        completeCallback();
                  }
            },
            
            postData: function(){
                  return this._postData;
            }
      });
      
})(jQuery, window);

/**
 * clase del pivot
 */
;(function($, window){
      
      $.extend(true, $.hik.catalogoTable5.prototype, {
            
            options:{
                  
            },
            
            _divPivot:{},
            _tablePivot:{},
            _tbodyPivot:{},
            _$divStatusPivot:{},
            
            _aPivotColumn: [],
            _aPivotCData: [],
            _indiceBusqueda: 0,
            _indiceData:0,
            _aSqlPivot : false,
            
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
                                    
                                    divPivot.dialog('close');
                              }
                        },{
                              text: 'Apply',
                              click: function () {
                                    
                                    self._pivotBottonOk();
                                    divPivot.dialog('close');
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
                  
                  //creamos la estructura de la tabla
                  var table = $('<table></table>').addClass('catalogo-table catalogo-table-striped catalogo-table-bordered table-hover').css('margin-top', '20px').appendTo(self._divPivot);
                  var tbody = $('<tbody></tbody>').appendTo(table); 
                  var tr = self._createTableTr(tbody);
                  
                  // creamos las cabeceras de la tabla del filtro
                  self._createTableTh({width:'50px', title:'Condicion'}, '', tr);
                  self._createTableTh({width:'50px', title:'Campo'}, '', tr);
                  self._createTableTh({width:'50px', title:'Filtro'}, '', tr);
                  self._createTableTh({width:'50px', title:'Valor'}, '', tr);
                  self._createTableTh({width:'50px', title:''}, '', tr);
                  
                  //guardamos los variables dentro del objeto
                  self._tablePivot = table;
                  self._tbodyPivot = tbody;
                  
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
                  var tr = self._createTableTr(self._tbodyPivot);
                  var tdCondicion = self._createTableTd(tr);
                  var tdCampo = self._createTableTd(tr);
                  var tdFiltro = self._createTableTd(tr);
                  var tdValor = self._createTableTd(tr);
                  var tdEliminar = self._createTableTd(tr);
                  
                 // colocamos el nombre de la condicion 
                  var aCondicion = $('<a></a>').text('And').attr('data-indicebusqueda', self._indiceBusqueda).appendTo(tdCondicion);
                  
                  // colocamos el nombre del campo
                  var aCampo = $('<a></a>').text(field.title).attr('data-indicebusqueda', self._indiceBusqueda).attr('data-indicedata', self._indiceData).appendTo(tdCampo);
                  
                  // filtro por default en una condicion and es equals
                  var aFiltro = $('<a></a>').text("Equals").attr('data-indicebusqueda', self._indiceBusqueda).attr('data-indicedata', self._indiceData).appendTo(tdFiltro);
                  
                  //colocamos el input que contendra el valor a buscar
                  var aInput = $('<input type="text" />').appendTo(tdValor);
                  
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
                        self._clickFiltro(position, $(this), tdValor);
                  });
                  
                  //para guardar el valor del input
                  aInput.change(function(){
                        
                        var value = $(this).val();
                        
                        if(value == ""){
                              return;
                        }
                        
                        arrayAnd[2] = value;
                  });
                  
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
                  $.each(self.options.columns, function(keyColumna, valorColumna){
                        
                        //validamos que no se incluya la columna de acciones
                        if(valorColumna.title != 'Acciones'){
                              
                              li = $('<li></li>').appendTo(ul);
                              $('<a tabindex="-1" ></a>').text(valorColumna.title).appendTo(li).click(function(){
                                    //cambiamos el nombre de la columna a buscar
                                    item.text(valorColumna.title);
                                    //guardamos los datos en un array temporal
                                    self._aPivotCData[indiceData][0] = valorColumna.pivot_title;
                                    self._aPivotCData[indiceData][3] = valorColumna.title;
                              });
                        }
                  });
            },
            
            //muestra el menu de los filtros
            _clickFiltro: function(position, item, td){
                  var self = this;
                  var ul = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>').css({
                        top:position.top + 20, 
                        left:position.left,
                        display:'block'
                        }).appendTo(self._divPivot);
                  
                  $('<li><a tabindex="-1" href="#">Equals</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item,'Equals', td);
                        self._cambiarFiltro('Equals',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Does not equal</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Does not equal', td);
                        self._cambiarFiltro('Does not equal',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is greater than</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is greater than', td);
                        self._cambiarFiltro('Is greater than',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is greater than or equal to</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is greater than or equal to', td);
                        self._cambiarFiltro('Is greater than or equal to',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is less than</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is less than', td);
                        self._cambiarFiltro('Is less than',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is less than or equal to</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is less than or equal to', td);
                        self._cambiarFiltro('Is less than or equal to',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is between</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is between', td);
                        self._cambiarFiltro('Is between',item);
                  });
                  
                  $('<li><a tabindex="-1" href="#">Is not between</a></li>').appendTo(ul).click(function(e){
                        e.preventDefault();
                        self._createInputBusqueda(item, 'Is not between', td);
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
            
            _createInputBusqueda: function(item, title, td){
                  
                  var self = this;
                  var indiceBusqueda = item.attr('data-indicebusqueda');
                  var indiceData = item.attr('data-indicedata');
                  
                  if(title == 'Is between' || title == 'Is not between'){
                        
                        td.empty();
                        
                        var input1 = $('<input type="text" class="input-mini" />').appendTo(td);
                        var input2 = $('<input type="text" class="input-mini" />').appendTo(td);
                        
                        input1.change(function(){
                              var val = $(this).val();
                              var val2 = input2.val();
                              self._aPivotCData[indiceData][2] = val+'='+val2;
                        });
                        
                        input2.change(function(){
                              var val2 = $(this).val();
                              var val = input1.val();
                              self._aPivotCData[indiceData][2] = val+'='+val2;
                        });
                  } 
                  
                  
            }
            
      });
      
})(jQuery, window);

/**
 * Clase que contendra los metdos necesarios para crear los formularios del grid
 */
;(function($, window, undefined){
      
      //extendemos del plugin catalogoTable
      $.extend(true, $.hik.catalogoTable5.prototype, {
            
            /**
             * Metodo privado que se encargara de crear los input-text 
             * 
             */
            _createInputForRecordField: function(fieldName, id, value, i){
                  
                  // creamos un objeto que contendra la configuracion que el usuario asigno para este input
                  var field = this.options.columns[fieldName];
                  
                  // validamos si el query arrojo un valor para este elemento
                  value = (typeof value != 'undefined') ? value : '';
                  
                  // validamos si el usuario agrego un valor por default para el input
                  if((value == '') && (typeof field.default_value !='undefined')){
                        
                        value = field.default_value;
                  }
                  
                  if(field.type == 'text'){
                        
                      return this._createInputText(field, fieldName, id, value, i);
                  }
                  
                  if(field.type == 'hidden'){
                        
                      return this._createInputHidden(field, fieldName, id, value, i);
                  }
                  
                  if(field.type == 'date'){
                        
                      return   this._createInputDate(field, fieldName, id, value, i);
                  }
                  
                  if(field.type == 'autocomplete'){
                      
                      return this._createInputAutocomplete(field, fieldName, id, value, i);
                  }
                  
                  if(field.type == 'textarea'){
                        
                      return this._createTextarea(field, fieldName, id, value, i);
                  }
                  
                  if(field.type == 'checkbox'){
                        
                      return this._createInputCheckbox();
                  }
                  
                  if(field.type == 'radiobutton'){
                        
                       return this._createInputRadioButton();
                  }
                  
                  if(field.type == 'select'){
                        
                      return this._createSelect(field, fieldName, id, value, i);
                  }
                  
                  if(field.type == 'link'){
                      
                      return this._createLink(field, fieldName, id, value, i);
                  }
            },
            
            /**
             * funcion que se encarga de crear el campo input tipo texto
             */
            _createInputText: function(field, fieldName, id, value){
                  
                  
                  var input = $('<input ' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + fieldName + '" data-role-id="'+ id +'" type="text"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '" />');
                  
                  if(typeof field.events != 'undefined'){
                        
                        $.each(field.events, function(indexEvent, fnEvent){
                              
                              input.on(indexEvent, fnEvent);
                        });
                  }
                  
                  return input;
            },
            
            /**
             * funcion que se encarga de crear el campo input tipo hidden
             */
            _createInputHidden: function(field, fieldName, id, value){
                  
                  return $('<div class="jtable-input jtable-text-input"><input ' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + fieldName + '" type="hidden"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '"></input></div>');
            },
            
            /**
             * funcion que se encarga de crear el campo de input de texto con la configuracion de datepicker del plugin de jquery ui
             */
            _createInputDate: function(field, fieldName, id, value, i){
                  
                  var displayFormat = field.displayFormat || this.options.defaultDateFormat;
                  var input = $('<input ' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + i + '"_"' + fieldName + '" type="text"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '"></input>');
                  
                  input.datepicker({ dateFormat: displayFormat});
                  
                  if(typeof field.events != 'undefined'){
                        
                        $.each(field.events, function(indexEvent, fnEvent){
                              
                              input.on(indexEvent, fnEvent);
                        });
                  }
                  
                  return input
            },
            
            /**
             *
             */
            _createInputAutocomplete: function(field, fieldName, id, value){
                  var source = [];
                  var input = $('<input "' + (field.inputClass != undefined ? 'class="'+ field.inputClass +'"' : '') + ' id="' + fieldName + '" type="text"' + (value != undefined ? 'value="' + value + '"' : '') + ' name="' + fieldName + '"></input>');
                  
                  source = this._getOptionsWithCaching(fieldName);
                  
                  input.autocomplete({
                        source: source
                  });
                  
                  return input;
            },
            
            /**
             * funcion que se encarga de crear en campo textarea 
             */
            _createTextarea: function(field, fieldName, id, value){
                  
                  var textarea = $('<textarea class="' + field.inputClass + '" id="' + fieldName + '" name="' + fieldName + '">' + (value || '') + '</textarea>');
                  
                  if(typeof field.events != 'undefined'){
                        
                        $.each(field.events, function(indexEvent, fnEvent){
                              
                              textarea.on(indexEvent, fnEvent);
                        });
                  }
                  
                  return textarea;
            },
            
            _createSelect: function(field, fieldName, id, value){

                  //Create select element
                  var select = $('<select class="' + field.inputClass + '" id="' + fieldName + '" name=' + fieldName + '></select>');

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

                  return select;
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
                              
                              div = $('<div></div>').dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: self.options.messages.cannotLoadOptionsFor,
                                    buttons: [{
                                          text: self.options.messages.btnClose,
                                          click: function () {
                                                div.dialog('close');
                                                div.remove();
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
            },
            
            _createLink: function(field, fieldName, value){
                  
                  var link = $('<a></a>').text(value);
                  
                  if(typeof field.events != 'undefined'){
                        
                        $.each(field.events, function(indexEvent, fnEvent){
                              
                              link.on(indexEvent, fnEvent);
                        });
                  }
                  
                  return link;
            }
            
      });
      
})(jQuery, window);