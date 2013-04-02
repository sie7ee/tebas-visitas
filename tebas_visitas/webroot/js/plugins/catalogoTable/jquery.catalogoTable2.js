;
(function($, window, undefined){
      
      $.widget("hik.catalogoTable2", {
            
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
                  columns: {},
                  buttons: {},
                  actions_row:{},
                  messages: {
                        msgServerCommunicationError: 'A ocurrido un error al comunicarse con el servidor.',
                        msgNoDataAvailable: 'Datos no disponibles!',
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
            
            _$ulPivotMain:{},
            _$liPivotMain:{},
            _$liPivotCondition:{},
            _$divStatusPivot:{},

            
            _aPivotColumn: [],
            _aPivotCData: [],
            _cPivotAC: 0,
            _cPivotACD: 0,
            _aSqlPivot : false,
           
            
            _aColumns: null,
            _aDataLoad: null,
            _totalRows: null,
            _totalRowsSearch: null,
            _pagHasta:null,
            _paginaActual: null,
            
            _ulPivot: null,
            
            _order: null,
            _limit: null,
            _offset: null,
            _campo: null,
            _querySuccess:null,
            
            
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
                  
                  this._ulPivot = [];
                  this._aPivot = {};
                  
                  this._aPivotColumn= [];
                  this._aPivotCData= [];
                  this._aSqlPivot = false;
                  this._cPivotAC= 0;
                  this._cPivotACD= 0;
                  
                  this._order = this.options.paginate.order;
                  this._limit = this.options.paginate.limit;
                  this._offset = this.options.paginate.offset;
                  this._campo = this.options.paginate.campo;
                  this._paginaActual = 1;
                  this._querySuccess = false;
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
            
            /**
             * Funcion que se encarga de cargar los datos al entrar a catalogo por primera vez
             */
            _loadData: function(){
                  
                  var self = this;
                  var json = {
                        order: self._order,
                        limit: self._limit,
                        offset: self._offset,
                        campo: self._campo,
                        sql: self._aSqlPivot
                  };
                        
                  $.ajax({
                        url: self.options.load_url,
                        type:'POST',
                        async: false,
                        data: json,
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
                  
                  this._aDataLoad = request.data;
                  this._totalRows = request.total_rows;
                  this._totalRowsSearch = request.total_rows_search;
                  this._querySuccess = request.success;
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
            
            _createTableTr: function(thead){    
                  
                  return $('<tr></tr>').appendTo(thead);
            },
            
            _createTableTh: function(field, columnTitle, ttr){
                  
                  var self = this;
                  var tth = $('<th></th>').attr('width', field.width).text(field.title).appendTo(ttr);
                
                  if(field.sortable){
                       
                        $('<span></span>').addClass("icon-arrow-down").appendTo(tth).click(function(){
                              self._campo = columnTitle;
                              self._order = (self._order == 'ASC') ? 'DESC' : 'ASC';
                              self._reloadTable();
                        });
                  }
                 
                  if(field.pivot){
                       
                        $('<span></span>').addClass('icon-search').appendTo(tth).click(function(){
                             
                              self._createDivPivot(field);
                        });
                  }
                        
            },
            
            //////////////////////////////////////////////////////////////////////////////////////////
            // METODOS PARA EL PIVOT
            /////////////////////////////////////////////////////////////////////////////////////////
            
            /**
             * cominza la parte de crear el pivot 
             * 
             */
            _createDivPivot:function(field){
                  
                  var self = this;
                  var divPivot = $('<div></div>').addClass('catalogo-table-pivot').appendTo(self._$mainContainer).dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'FILTER BUILDER',
                        width:500,
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
                  
                  self._createUlMain(divPivot, field);
            },
            
            // se encarga de ejecutar el pivot
            _pivotBottonOk: function(){
                  
                  this._createJsonPivot();
                  this._reloadTable();
                  this._initializePivot();
            },
            
            // seteamos los valores del pivot
            _initializePivot: function(){
                  
                  this._aPivotColumn = [];
                  this._aPivotCData = [];
                  this._cPivotAC = 0;
                  this._cPivotACD = 0;
            },
            
            // se encarga de crear el array con los datos para realizar la busqueda
            _createJsonPivot: function(){
                  
                  var aColumns = this._aPivotColumn;
                  var aData = this._aPivotCData;
                  var newJson = {};
                  
                  
                  
                  for(var i=0; i <= aColumns.length - 1; i++){
      
                        if((aData[i] != undefined) && (aData[i].length > 0)){
                                    
                              if(aColumns[i] != ''){
                                    
                                    newJson[aColumns[i]] = aData[i];
                              }
                        }
                  }
                  
                  this._aSqlPivot = newJson;
                  
                  console.log(this._aSqlPivot);
            },
            
            _createStatusPivot: function(newJson, divBoxFooter){
                  
                  var self = this;
                  var sConsulta = '';
                  var spanPaginate = $('<span></span>').appendTo(divBoxFooter);
                  
                  // generamos el string de la consulta a buscar en el pivot para mostrarla al usuario en la parte inferior del grid
                  // en el paginado
                  $.each(newJson, function(index, value){
                        
                        $.each(value, function(i, val){
                              
                              sConsulta += ' [' + val[0] + '] ' + (self._createStatusPivotBsc(val[1])) + ' ' + val[2] + ' ';
                        });
                  });
                  
                  // agregamos la consulta en el paginado
                  spanPaginate.text(sConsulta);
                  
                  // colomamos un boton para quitar la busqueda y carge los datos del grid normales
                  $('<a href="#">x</a>').appendTo(spanPaginate).click(function(e){
                        
                        e.preventDefault();
                        self._$mainContainer.empty();
                        self._create();
                        self._aSqlPivot = false;
                  });
                  
                  self._$divStatusPivot = spanPaginate;
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
            _createUlMain: function(divPivot, field){
                  
                  var self = this;
                  var ulMain = $('<ul></ul>').appendTo(divPivot);
                  var li = $('<li></li>').appendTo(ulMain);
                  
                  var a = $('<a></a>')
                        .text('And')
                        .attr('href', self._cPivotAC)
                        .css('color', 'red')
                        .appendTo(li)
                        .click(function(e){                              
                              e.preventDefault();
                              var position = $(this).position();
                              
                              self._createPivotMenuSearch(a, divPivot, field, position);
                              self._$ulPivotMain = ulMain;
                        });
                  
                  var ul = $('<ul></ul>').appendTo(li);

                  self._aPivotColumn.push('And'); 
                  self._createPivotSearchAnd(divPivot, '', ul, field);
                  self._$ulPivotMain = ulMain;
            },
            
            // menu desplegable que visualizara 
            _createPivotMenuSearch: function(a, divPivot, field, position){
                  
                  var self = this;
                  var divMenuSearch = $('<div></div>').addClass('menu-search-builder').css({
                        top:position.top + 5, 
                        left:position.left
                        }).appendTo(divPivot);
                  var ul = $('<ul></ul>').appendTo(divMenuSearch);
                  
                  $('<li><a href="#">And</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._updatePivotMenuSearch('And', a, divMenuSearch)
                  });
                  
                  $('<li><a href="#">Or</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._updatePivotMenuSearch('Or', a, divMenuSearch)
                  });
                  
                  $('<li><a href="#">Not And</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._updatePivotMenuSearch('Not And', a, divMenuSearch)
                  });
                  
                  $('<li><a href="#">Not Or</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._updatePivotMenuSearch('Not Or', a, divMenuSearch)
                  });
                  
                  $('<li><a href="#">Add Condition</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        
                        var li = $('<li></li>').appendTo(self._$ulPivotMain);
                        var ul = $('<ul></ul>').appendTo(li);

                        self._cPivotACD++;
                        self._createPivotSearchAnd(divPivot, divMenuSearch, ul, field);  
                        divMenuSearch.remove();
                  });
                  
                  $('<li><a href="#">Add Group</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._cPivotAC++;
                        
                        var li = $('<li></li>').appendTo(self._$ulPivotMain);
                        var ul = $('<ul></ul>').appendTo(li);
                        var lis = $('<li></li>').appendTo(ul);
                        
                        var a = $('<a>And</a>')
                                    .attr('href', self._cPivotAC)
                                    .css('color', 'red')
                                    .appendTo(lis)
                                    .click(function(e){
                              
                                          e.preventDefault();
                                          
                                          var position = $(this).position();
                                          self._$ulPivotMain = ul;
                                          self._$liPivotCondition = li;
                                          self._createPivotMenuSearch(a, divPivot, field, position);
                                    });
                        
                        var uls = $('<ul></ul>').appendTo(lis);
                       
                        self._cPivotACD=0;
                        self._aPivotColumn.push('And');
                        self._createPivotSearchAnd(divPivot, divMenuSearch, uls, field);  
                        divMenuSearch.remove();
                  });
                  
                  $('<li><a href="#">Clear</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var c = a.attr('href');
                        
                        self._aPivotColumn[c] = '';
                        self._$liPivotCondition.remove();
                        divMenuSearch.remove();
                  });
                  
                  $('<li><a href="#">Clear All</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._$liPivotMain.empty();
                        divMenuSearch.remove();
                  });
            },
            
            _updatePivotMenuSearch: function(title, a, divMenuSearch){
                  
                  var self = this;
                  var c = a.attr('href');
                        
                  a.text(title);
                  self._aPivotColumn[c] = title;
                  divMenuSearch.remove();
            },
            
            _createPivotSearchAnd: function(divPivot, divMenuSearch, ul, field){
                  
                  var self = this;
                  var li = $('<li></li>').appendTo(ul);
                  var aAnd = []
                  
                  if(typeof self._aPivotCData[self._cPivotAC] === 'undefined'){
                        
                        self._aPivotCData[self._cPivotAC] = [];
                  }
                  
                  aAnd[0] = field.pivot_title;
                  aAnd[1] = 'Equals';
                  aAnd[2] = '';
                  
                  $('<a href="'+ self._cPivotAC +'-'+ self._cPivotACD+'" style="color:blue;">[' + field.title + ']</a>').appendTo(li).click(function(e){
                        
                        e.preventDefault();
                        var a = $(this);
                        var position = $(this).position();
                        self._createPivotMenuColumns(divPivot, a, position);
                  });
                  
                  $('<a href="'+ self._cPivotAC +'-'+ self._cPivotACD+'" style="color:green;">Equals</a>').appendTo(li).click(function(e){
                        
                        e.preventDefault();
                        var a = $(this);
                        var position = $(this).position();
                        self._createPivotMenuCriterioSearch(divPivot, a, position);
                  });
                  
                  var span =  $('<span></span>').appendTo(li);
                  
                  $('<input type="text" class="input-mini" />').appendTo(span).change(function(){
                        
                        var value = $(this).val();
                        aAnd[2] = value;
                  });
                  
                  $('<a href="'+ self._cPivotAC +'-'+ self._cPivotACD +'" style="color:red;">Eliminar</a>').appendTo(li).click(function(e){
                        
                        e.preventDefault();
                        
                        var i = $(this).attr('href').split('-');
                        var c = i[0];
                        var d = i[1];
                        
                        self._aPivotCData[c][d] = '';

                        li.remove();
                  });
                  
                  self._aPivotCData[self._cPivotAC].push(aAnd);
            },
            
            _createPivotMenuColumns: function(divPivot, a, position){
                  
                  var self = this;
                  var divMenuSearch = $('<div></div>').addClass("menu-search-builder").css({
                        top:position.top + 5, 
                        left: position.left
                        }).appendTo(divPivot);
                  var ul = $('<ul></ul>').appendTo(divMenuSearch);
                  
                  $.each(self.options.columns, function(k, v){
                        
                        if(v.title != 'Acciones'){
                              
                              $('<li><a></a></li>').text(v.title).appendTo(ul).click(function(){
                                    
                                    var i = a.attr('href').split('-');
                                    var c = i[0];
                                    var d = i[1];
                                    
                                    a.text('[' + v.title + ']');
                                    divMenuSearch.remove();
                                    self._aPivotCData[c][d][0] = v.pivot_title;
                              });
                        }
                  });
            },
            
            _createPivotColumn: function(title){
                  
                  var r = '';
                  
                  $.each(this.options.columns, function(k, v){
                        
                        if(v.title == title){
                              r = k;
                        }
                  });
                  
                  return r;
            },
            
            _createPivotMenuCriterioSearch: function(divPivot, a, position){
                  
                  var self = this;
                  var divMenuCriteroSearch = $('<div></div>').addClass("menu-search-builder").css({
                        top:position.top + 5, 
                        left:position.left
                        }).appendTo(divPivot);
                  var ul = $('<ul></ul>').appendTo(divMenuCriteroSearch);
                  
                  $('<li><a href="#">Equals</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Equals');
                        self._updateCriterioSearch(a, 'Equals');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Does not equal</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Does not equal');
                        self._updateCriterioSearch(a, 'Does not equal');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is greater than</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is greater than');
                        self._updateCriterioSearch(a, 'Is greater than');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is greater than or equal to</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is greater than or equal to');
                        self._updateCriterioSearch(a, 'Is greater than or equal to');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is less than</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is less than');
                        self._updateCriterioSearch(a, 'Is less than');
                        divMenuCriteroSearch.remove();
                  });
                  
                  
                  $('<li><a href="#">Is less than or equal to</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is less than or equal to');
                        self._updateCriterioSearch(a, 'Is less than or equal to');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is between</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is between');
                        self._updateCriterioSearch(a, 'Is between');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is not between</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is between');
                        self._updateCriterioSearch(a, 'Is not between');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is blank</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is blank');
                        self._updateCriterioSearch(a, 'Is blank');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is not blank</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is not blank');
                        self._updateCriterioSearch(a, 'Is not blank');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is any of</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is any of');
                        self._updateCriterioSearch(a, 'Is any of');
                        divMenuCriteroSearch.remove();
                  });
                  
                  $('<li><a href="#">Is none of</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is none of');
                        self._updateCriterioSearch(a, 'Is none of');
                        divMenuCriteroSearch.remove();
                  });
            },
            
            _updateCriterioSearch: function(a, title){
                  
                  var self = this;
                  var i = a.attr('href').split('-');
                  var c = i[0];
                  var d = i[1];
                        
                  a.text(title);
                  self._aPivotCData[c][d][1] = title;
            },
            
            _createInputCriterioSearch: function(a, s, title){
                  
                  var self = this;
                  var i = a.attr('href').split('-');
                  var c = i[0];
                  var d = i[1];
                  
                  if(title == 'Is between' || title == 'Is not between'){
                        
                        s.empty();
                        var input1 = $('<input type="text" class="input-mini" />').appendTo(s);
                        var input2 = $('<input type="text" class="input-mini" />').appendTo(s);
                        
                        input1.change(function(){
                              
                              var val = $(this).val();
                              var val2 = input2.val();
                              self._aPivotCData[c][d][2] = val+'='+val2;
                        });
                        
                        input2.change(function(){
                              
                              var val2 = $(this).val();
                              var val = input1.val();
                              self._aPivotCData[c][d][2] = val+'='+val2;
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
            
            _createTableRowsLoadData:function(tbody){
                  
                        var self = this;
                        var ttr = {};
                        
                        //recorremos los nombres de las columnas que tendra el grid para cargar los datos del query
                        $.each(self._aDataLoad, function(keyData, valueData){
                              
                              // creamos la fila en la tabla
                              ttr = self._createTableTr(tbody);
                              
                              // recorremos los datos arrojados del query
                              $.each(self._aColumns, function(keyColumns, valueColumns){
                                    
                                    // si el usuario coloco una columna de acciones creamos los botones para cada accion,
                                    // de lo contrario colocamos los datos del query en la columna correspondiente
                                    if(valueColumns === 'actions'){
                                          
                                          self._createTableRowsActions(ttr, valueData.id);
                                          
                                    } else {
                                          
                                          self._createTableRowsData(ttr, valueData[valueColumns]);
                                    }
                              });
                        });
            },
            
            _createTableRowsActions: function(ttr, id){
                  
                  var self = this;
                  var ttd = self._createTableTd('', ttr);
                
                  //recorremos las acciones dadas de altas por el usuario para crear los botones correspondientes de cada accion
                  $.each(self.options.actions_row, function(keyAction, valueAction){
                        
                        //validamos si la accion cuenta con permisos para ser mostrado de acuerdo al rol del usuario y sus permisos
                        if(valueAction.permit){
                              
                              // creamos la accion
                              self._createTableTdAction(id, valueAction,ttd);
                        }
                  }); 
            },
            
            _createTableRowsData: function(ttr, data){
                  
                  var self = this;
                  
                  //validamos el dato a mostrar existe
                  if(data === undefined){
                                    
                        self._createTableTd('', ttr);
                                    
                  } else {
                        
                        self._createTableTd(data, ttr);
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
                  self._createTableTd('', ttr);
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
            
            _createTableTd: function(data, ttr){
                  
                  return $('<td style="vertical-align: middle;"></td>').text(data).appendTo(ttr);
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
                        
                  var spanPaginate = $('<span></span>').text('Pagina ' + this._paginaActual + ' de '+ this._pagHasta +' Items Busqueda(' + this._totalRowsSearch + ') Total Items(' + this._totalRows +')').appendTo(divBoxFooter);
                  
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
                                    self._reloadTable();
                              }
                        });
                  }
            },
                  
            _createTableButtonsPaginator: function(ul){
                  
                  //iniciamos variables a utilizar
                  var self = this;
                  var pagina = self._paginaActual;
                  var navIntervalo = parseInt(this._limit / 2) - 1;
                  var pagDesde = parseInt(pagina) - navIntervalo;
                  var pagHasta = parseInt(pagina) + navIntervalo;
                  var totalPaginas = self._totalPaginas((self._aSqlPivot != false ? self._totalRowsSearch : self._totalRows), this._limit);
                  var pagAux = 0;
                                                
                  if(pagDesde < 1){
                        
                        pagHasta -= (pagDesde -1);
                        pagDesde = 1;
                  }
        
                  if(pagHasta > totalPaginas){
                        
                        pagDesde -= (pagHasta - totalPaginas);
                        pagHasta = totalPaginas;
            
                        if(pagDesde < 1){
                              pagDesde = 1; 
                        }
                  }
                  
                  self._pagHasta = pagHasta;
                  
                  li = $('<li></li>').appendTo(ul);
                  
                  $('<a></a>').text('Inicio').attr('href', '1').appendTo(li).click(function(e){
                        e.preventDefault();
                        self._buttonClickPagination(1, self._limit);
                  });
                  
                  li = $('<li></li>').appendTo(ul);
                                    
                  $('<a>&larr;</a>').attr('href', pagHasta).appendTo(li).click(function(e){       
                        e.preventDefault();
                        pagAux = (parseInt(self._paginaActual) > 1) ? parseInt(self._paginaActual) - 1 : pagDesde;
                        self._buttonClickPagination(pagAux, self._limit);
                  });
                  
                  // genersmos los numeros en el paginado 
                  for(var i = pagDesde; i <= pagHasta; i++){
                        
                        li = $('<li></li>').appendTo(ul);
                        
                        $('<a></a>').attr('href', i).text(i).appendTo(li).click(function(e){
                              e.preventDefault();
                              pagAux = parseInt($(this).attr('href'));
                              self._buttonClickPagination(pagAux, self._limit);
                        });
                              
                  }
                  
                  li = $('<li></li>').appendTo(ul);

                  $('<a>&rarr;</a>').attr('href', '#').appendTo(li).click(function(e){
                        e.preventDefault();
                        pagAux = (parseInt(self._paginaActual) < pagHasta) ? parseInt(self._paginaActual) + 1 : pagHasta;
                        self._buttonClickPagination(pagAux, self._limit);
                  });
                  
                  li = $('<li></li>').appendTo(ul);
                  
                  $('<a></a>').text('Fin').attr('href', totalPaginas).appendTo(li).click(function(e){
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
                  this._reloadTable();
                  this._$ulPaginate.empty();
                  this._createTableButtonsPaginator(this._$ulPaginate);
            },
            
            _reloadTable: function(pivot, stringPaginado){
                  
                  this._removeGrid();
                  this._loadData();
                  this._createGrid();
                  
                  if(this._aSqlPivot != false){
                        this._createStatusPivot(this._aSqlPivot, this._$divBoxFooter);
                  } 
                  
                  this._$spanPaginate.text('Pagina ' + this._paginaActual + ' de '+ this._pagHasta +' Items Busqueda(' + this._totalRowsSearch + ') Total Items(' + this._totalRows +')');
            },
            
            /**
             * Funcion que se encarga de limpiar todo el div que contendra el grid 
             */
            _removeGrid:function(){
                  
                  this._$mainContainer.empty();
            },
            
            /**
             * Funcion que se encarga de limpiar el body del grid quitando todas las filas
             */
            _removeBody: function(){
                  
                  this._$tableBody.empty();
            },
            
            /**
             * Funcion que se encarga de eliminar el div del paginado
             */
            _removePagination: function(){
                  
                  this._$tableBody.empty();
            },
            
            
            //////////////////////////////////////////////////////
            //    METODOS PUBLICOS
            /////////////////////////////////////////////////////
            
            
            create: function(){
                  this._create();
            }
            
            
      });
      
})(jQuery, window);