;
(function($){
      
      $.widget("hik.catalogoTable", {
            
            options: {
                  
                  title : '',
                  actions:{
                        load_url: '',
                        add_url:'',
                        edit_url:'',
                        view_url:'',
                        delete_url:'',
                        reportpdf_url:'',
                        reportexcel_url:''
                  },
                  paginate:{
                        order: 'DESC',
                        campo: 'id',
                        limit: 15,
                        offset: 0
                  },
                  columns: {},
                  rowActions:{},
                  buttons: {},
                  messages: {
                        msgServerCommunicationError: 'A ocurrido un error al comunicarse con el servidor.',
                        msgSloading: 'Cargando datos...',
                        msgNoDataAvailable: 'Datos no disponibles!',
                        msgAreYouSure: 'Seguro que desea continuar?',
                        magCannotLoadOptionsFor: 'No se puede cargar los registros {0}',
                        titleError: 'Error',
                        titleWarning: 'Atencion!',
                        btnClose: 'Cerrar',
                        btnSave: 'Guardar',
                        btnCancel: 'Cancelar'
                  },
            
                  formClose: function(){},
                  formSaveSubmit: function(){},
                  formValidationEngine: function(){},
                  formSaveClick:function(){}
            },
            
            _$mainContainer: {},
            _$divDialogMsg: {},
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
            _aPivotColumn: [],
            _aPivotCData: [],
            _aPivotTemp:{},
            _cPivotAC: 0,
            _cPivotACD: 0,
            _aSqlPivot : false,
            
            _aColumns: null,
            _aDataLoad: null,
            _totalRows: null,
            _paginaActual: null,
            
            _ulPivot: null,
            
            _order: null,
            _limit: null,
            _offset: null,
            _campo: null,
            _pag:1,
            
            
            fnAdd: function(){},
            fnEdit: function(){},
            fnDelete: function(){},
            
            _initialize: function(){
                  
                  this._$mainContainer = this.element;
                  this._aColumns = [];
                  this._aDataLoad = [];
                  this._totalRows = 0;
                  
                  this._ulPivot = [];
                  this._aPivot = {};
                  
                  this. _aPivotColumn= [];
                  this._aPivotCData= [];
                  this._aSqlPivot = false;
                  this._cPivotAC= 0;
                  this._cPivotACD= 0;
                  
                  this._order = this.options.paginate.order;
                  this._limit = this.options.paginate.limit;
                  this._offset = this.options.paginate.offset;
                  this._campo = this.options.paginate.campo;
                  this._paginaActual = 1;
            },
                  
            _loadConfig: function(){
                  
                  this._loadColumns();
                  this._loadData();
            },
            
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
                        url: self.options.actions.load_url,
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
            
            _loadDataSuccess: function(data){
                  
                  var self = this;
                  var r = data; 
                  
                  if((typeof(r.total_rows) == 'undefined') && (parseInt(r.total_rows) == 0)){
                        
                        self._$divDialogMsg = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                        self._$divDialogMsg.text(self.options.messages.msgNoDataAvailable).dialog({
                              autoOpen: true,
                              modal: true,
                              title: self.options.messages.titleWarning,
                              buttons: [{
                                    text: self.options.messages.btnClose,
                                    click: function () {
                                          self._$divDialogMsg.dialog('close');
                                    }
                              }]
                        });
                  }
                  
                  this._aDataLoad = r.data;
                  this._totalRows = r.total_rows;
            },
            
            _loadDataError: function(){
                  
                  var self = this;
                  
                  self._$divDialogMsg = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                  self._$divDialogMsg.text(self.options.messages.msgServerCommunicationError).dialog({
                        autoOpen: true,
                        modal: true,
                        title: self.options.messages.titleError,
                        buttons: [{
                              text: self.options.messages.btnClose,
                              click: function () {
                                    self._$divDialogMsg.dialog('close');
                              }
                        }]
                  });
            },
            
            _create: function(){
                  
                  this._construct();
                  this._createGrid();
            }, 
                 
            _construct: function(){
                  
                  this._initialize();
                  this._loadConfig();
            },
                 
            _createGrid: function(){
                  
                  this._createContainerGrid();
                  this._createTitleGrid();
                  this._createButtonsGrid();
                  this._createTable();
                  this._createTableHead();
                  this._createTableTbody();
                  this._createTableFoot();
            },
                  
            _createContainerGrid: function(){
                        
                  var containerTable = $('<div class="row-fluid"></div>').appendTo(this._$mainContainer);
                  var containerSpan = $('<div class="span12"></div>').appendTo(containerTable);
                  var divBox = $('<div class="box"></div>').appendTo(containerSpan);
                  var divBoxHeader = $('<div class="box-info-table box-head tabs"></div>').appendTo(divBox);
                        
                  this._$divBox = divBox;
                  this._$divBoxHeader = divBoxHeader;
            },
                  
            _createTitleGrid: function(){
                        
                  if(this.options.title == ''){
                        return;
                  }
                        
                  $('<h3></h3>').appendTo(this._$divBoxHeader).text(this.options.title);
            },
                  
            _createButtonsGrid: function(){
                  
                  var self = this;
                        
                  if(self.options.buttons == null){
                        
                        return;
                  }
                        
                  var contButtons = $('<ul class="nav nav-tabs"><ul>').appendTo(this._$divBoxHeader);
                        
                  $.each(self.options.buttons, function(k, v){
                              
                        self._createOptionButton(contButtons, self.options.buttons[k]);
                  });
            },
                  
            _createOptionButton: function(contButtons, button){
                  
                  // falta pensar como hacerlo dinamico por cuestiones de tiempo quedo asi 
                  var a = undefined;
                  var li = undefined;
                  
//                  if(button.title == 'Nuevo'){
//                        
//                        if(this.options.permits.add){
//                              li = $('<li></li>').appendTo(contButtons);    
//                              a = $('<a href="#"  id="' + button.title + '" data-toggle="tab"> ' + button.title +'</a>').appendTo(li);
//                              this._$btnNew = a;
//                        }
//                        
//                  }
                  
//                  if(button.title == 'Editar'){
//                        
//                        if(this.options.permits.edit){
//                              li = $('<li></li>').appendTo(contButtons);    
//                              a = $('<a href="#"  id="' + button.title + '" data-toggle="tab"> ' + button.title +'</a>').appendTo(li);
//                              this._$btnEdit = a;
//                        }
//                        
//                  }
//                  
//                  if(button.title == 'Eliminar'){
//                        
//                        if(this.options.permits.deleted){
//                              li = $('<li></li>').appendTo(contButtons);    
//                              a = $('<a href="#"  id="' + button.title + '" data-toggle="tab"> ' + button.title +'</a>').appendTo(li);
//                              this._$btnDelete = a;
//                        }
//                        
//                  }
                  
                  if(button.title == 'Pdf'){
                        
                        if(this.options.permits.view_pdf){
                              li = $('<li></li>').appendTo(contButtons);    
                              a = $('<a href="#"  id="' + button.title + '" data-toggle="tab"> ' + button.title +'</a>').appendTo(li);
                              this._$btnPdf = a;
                        }
                        
                  }
                  
                  if(button.title == 'Excel'){
                        
                        if(this.options.permits.view_excel){
                              li = $('<li></li>').appendTo(contButtons);    
                              a = $('<a href="#"  id="' + button.title + '" data-toggle="tab"> ' + button.title +'</a>').appendTo(li);
                              this._$btnExcel = a;
                        }
                        
                  }
            },
                  
            _createTable: function(){
                  
                  var divBoxNoMargin = $('<div class="box-content box-nomargen"></div>').appendTo(this._$divBox);
                  var table = $('<table class="catalogo-table catalogo-table-striped catalogo-table-bordered"></table>').appendTo(divBoxNoMargin);
                  
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
                  
                  var ttr = $('<tr></tr>').appendTo(thead);
                  return ttr;
            },
                  
            _createTableTh: function(field, columnTitle, ttr){
                  
                  var self = this;
                  var tth = $('<th width="'+ field.width +'" > ' + field.title + ' </th>').appendTo(ttr);
                
                  if(field.sortable){
                       
                        $('<span> s </span>').appendTo(tth).click(function(){
                             
                              self._campo = columnTitle;
                              self._order = (self._order == 'ASC' ? 'DESC' : 'ASC');
                              self._reloadTable();
                        });
                  }
                 
                  if(field.pivot){
                       
                        $('<span> p </span>').appendTo(tth).click(function(){
                             
                              self._createDivPivot(field.title);
                        });
                  }
                        
            },
            
            _createDivPivot:function(titleTh){
                  
                  var self = this;
                  var divPivot = $('<div class="catalogo-table-pivot"></div>').appendTo(self._$mainContainer).dialog({
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
                  
                  self._createUlMain(divPivot, titleTh);
            },
            
            _pivotBottonOk: function(){
                  this._createJsonPivot();
                  this._reloadTable();
                  this._initializePivot();
            },
            
            _initializePivot: function(){
                  this._aPivotColumn = [];
                  this._aPivotCData = [];
                  this._aSqlPivot = false;
                  this._cPivotAC = 0;
                  this._cPivotACD = 0;
            },
            
            _createJsonPivot: function(){
                  
                  var aColumns = this._aPivotColumn;
                  var aData = this._aPivotCData;
                  var newJson = {};
                  
                  for(var i=0; i <= aColumns.length - 1; i++){
                        
                        if(aColumns[i] != ''){
                              
                              if((typeof(aData[i]) != 'undefined') && (aData[i].length > 0)){
                                    
                                    newJson[aColumns[i]] = aData[i];
                              }
                        }
                  }
                  
                  this._aSqlPivot = newJson;
            },
            
            _createUlMain: function(divPivot, titleTh){
                  
                  var self = this;
                  var ulMain = $('<ul></ul>').appendTo(divPivot);
                  var li = $('<li></li>').appendTo(ulMain);
                  
                  var a = $('<a href="'+ self._cPivotAC +'" style="color:red;">And</a>').appendTo(li).click(function(e){
                        
                        e.preventDefault();

                        self._createPivotMenuSearch(a, divPivot, titleTh);
                        self._$ulPivotMain = ulMain;
                  });
                  
                  var ul = $('<ul></ul>').appendTo(li);

                  self._aPivotColumn.push('And'); 
                  self._createPivotSearchAnd(divPivot, '', ul, titleTh);
                  self._$ulPivotMain = ulMain;
            },
            
            _createPivotMenuSearch:function(a, divPivot, titleTh){
                  
                  var self = this;
                  var divMenuSearch = $('<div class="menu-search-builder"></div>').appendTo(divPivot);
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
                        self._createPivotSearchAnd(divPivot, divMenuSearch, ul, titleTh);  
                        divMenuSearch.remove();
                  });
                  
                  $('<li><a href="#">Add Group</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        self._cPivotAC++;
                        
                        var li = $('<li></li>').appendTo(self._$ulPivotMain);
                        var ul = $('<ul></ul>').appendTo(li);
                        var lis = $('<li></li>').appendTo(ul);
                        
                        var a = $('<a href="'+ self._cPivotAC +'" style="color:red;">And</a>').appendTo(lis).click(function(e){
                              
                              e.preventDefault();
                              
                              self._$ulPivotMain = ul;
                              self._$liPivotCondition = li;
                              self._createPivotMenuSearch(a, divPivot, titleTh);
                        });
                        
                        var uls = $('<ul></ul>').appendTo(lis);
                       
                        self._cPivotACD=0;
                        self._aPivotColumn.push('And');
                        self._createPivotSearchAnd(divPivot, divMenuSearch, uls, titleTh);  
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
            
            _createPivotSearchAnd: function(divPivot, divMenuSearch, ul, title){
                  
                  var self = this;
                  var li = $('<li></li>').appendTo(ul);
                  var aAnd = []
                  
                  if(typeof(self._aPivotCData[self._cPivotAC]) == 'undefined'){
                        
                        self._aPivotCData[self._cPivotAC] = [];
                  }
                  
                  aAnd[0] = self._createPivotColumn(title);
                  aAnd[1] = 'Equals';
                  aAnd[2] = '';
                  
                  $('<a href="'+ self._cPivotAC +'-'+ self._cPivotACD+'" style="color:blue;">[' + title + ']</a>').appendTo(li).click(function(e){
                        
                        e.preventDefault();
                        var a = $(this);
                        self._createPivotMenuColumns(divPivot, a);
                  });
                  
                  $('<a href="'+ self._cPivotAC +'-'+ self._cPivotACD+'" style="color:green;">Equals</a>').appendTo(li).click(function(e){
                        
                        e.preventDefault();
                        var a = $(this);
                        self._createPivotMenuCriterioSearch(divPivot, a);
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
            
            _createPivotMenuColumns: function(divPivot, a){
                  
                  var self = this;
                  var divMenuSearch = $('<div class="menu-search-builder"></div>').appendTo(divPivot);
                  var ul = $('<ul></ul>').appendTo(divMenuSearch);
                  
                  $.each(self.options.columns, function(k, v){
                        
                        if(v.title != 'Acciones'){
                              
                              $('<li><a>'+ v.title +'</a></li>').appendTo(ul).click(function(){
                                    
                                    var i = a.attr('href').split('-');
                                    var c = i[0];
                                    var d = i[1];
                                    
                                    a.text('[' + v.title + ']');
                                    divMenuSearch.remove();
                                    self._aPivotCData[c][d][0] = k;
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
            
            _createPivotMenuCriterioSearch: function(divPivot, a){
                  
                  var self = this;
                  var divMenuCriteroSearch = $('<div class="menu-search-builder"></div>').appendTo(divPivot);
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
                  
                  $('<li><a href="#">Is grater than</a></li>').appendTo(ul).click(function(e){
                        
                        e.preventDefault();
                        var s = a.parent('li').find('span');
                        
                        self._createInputCriterioSearch(a, s, 'Is grater than');
                        self._updateCriterioSearch(a, 'Is grater than');
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
                              self._aPivotCData[c][d][2] = val+'-'+val2;
                        });
                        
                        input2.change(function(){
                              
                              var val2 = $(this).val();
                              var val = input1.val();
                              self._aPivotCData[c][d][2] = val+'-'+val2;
                        });
                  } 
            },
            
                  
            _createTableTbody: function(){
                        
                  var self = this;
                  
                  if(self.options.columns != null){
                        
                        var tbody = $('<tbody></tbody>').appendTo(self._$table);
                        
                        self._createTableRows(tbody);
                        self._$tableBody = tbody;
                  }
            },
            
            _createTableRows: function(tbody){
                  
                  var self = this;
                  
                  $.each(self._aDataLoad, function(kd, vd){
                              
                        var ttr = self._createTableTr(tbody);
                              
                        $.each(self._aColumns, function(kc, vc){  
                              
                              if(self._totalRows > 0){
                                    
                                    if(vc == 'actions'){
                                          var ttd = self._createTableTd('', ttr)
                                          $.each(self.options.actions, function(k, v){
                                          
                                                if((k == 'view_url') && (v != '') && (self.options.permits.view == true)){
                                                            
                                                      self._createTableTdActionView(self._aDataLoad[kd]['id'], ttd);
                                                            
                                                } else if((k == 'delete_url') && (v != '') && (self.options.permits.deleted == true)){
                                                            
                                                      self._createTableTdActionDelete(self._aDataLoad[kd]['id'], ttd);
                                                            
                                                }
                                          }); 
                                          
                                    } else {
                                          
                                          if(typeof(self._aDataLoad[kd][self._aColumns[kc]]) != 'undefined'){
                                    
                                                self._createTableTd(self._aDataLoad[kd][self._aColumns[kc]], ttr);
                                    
                                          } else {
                                    
                                                self._createTableTd('', ttr);
                                          } 
                                    } 
                                    
                              } else {
                                    
                                    self._createTableTd('', ttr);
                              }
                        });
                  });
            },
            
            _createTableTdActionView: function(id, ttd){
                  
                  var self = this;
                 
                  $('<a href="'+ id +'" title="Ver" class="btn  btn-primary" style="margin-left:5px;"> Ver </a>').appendTo(ttd).click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        self.fnView(id);
                        
                        self._$tableBodyTr = $(this).parent('tr');
                  });
            },
            
            _createTableTdActionDelete: function(id, ttd){
                  
                  var self = this;
                  $('<a href="'+ id +'" title="Editar" class="btn btn-primary " style="margin-left:5px;"> Eliminar </a>').appendTo(ttd).click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        
                        self.fnDelete(id);
                  });
            },
                  
            _createTableTd: function(data, ttr){
                  
                  return $('<td> ' + data + ' </td>').appendTo(ttr);
            },
                  
            _createTableFoot: function(){
                  
                  var divBoxFooter = $('<div class="box-info-table box-footer"></div>').appendTo(this._$divBox);
                  
                  this._createTablePages(divBoxFooter);
                  this._createTablePaginator(divBoxFooter);
            },
                  
            _createTablePages: function(divBoxFooter){
                        
                  var spanPaginate = $('<span>Total de paginas '+ this._totalRows +'</span>').appendTo(divBoxFooter);
                  
                  this._$spanPaginate = spanPaginate;
            },
                  
            _createTablePaginator: function(divBoxFooter){
                  
                  var divButtonsPaginator = $('<div class="pagination" style="float:right; margin: 0;"><div>').appendTo(divBoxFooter);
                  var ul = $('<ul></ul>').appendTo(divButtonsPaginator);
                  
                  this._createTableButtonsPaginator(ul);
                  this._$ulPaginate = ul;
            },
                  
            _createTableButtonsPaginator: function(ul){
                  
                  var self = this;
                  var pagina = self._paginaActual;
                  var navIntervalo = parseInt(this.options.paginate.limit / 2) - 1;
                  var pagDesde = parseInt(pagina) - navIntervalo;
                  var pagHasta = parseInt(pagina) + navIntervalo;
                  var totalPaginas = self._totalPaginas(this._totalRows, this.options.paginate.limit);
                  var li = {};
                  var pag = undefined;
                  
                                                
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
                  
                  
                  li = $('<li></li>').appendTo(ul);
                  
                  $('<a href="'+ pagDesde +'"> Inicio </a>').appendTo(li).click(function(e){
                              
                        e.preventDefault();
                        pag = $(this).attr('href');
                        self._pag = pag;
                        self._buttonClickPagination(pag, self._limit);
                  });
                  
                  li = $('<li></li>').appendTo(ul);
                  
                  $('<a href="'+ pagHasta +'"> &larr;</a>').appendTo(li).click(function(e){
                              
                        e.preventDefault();
                        pag = (self._pag > 1 ? self._pag - 1 : pagHasta);
                        self._pag = pag;
                        self._buttonClickPagination(pag, self._limit);
                  });
                        
                  for(var i = pagDesde; i <= pagHasta; i++){
                        
                        li = $('<li></li>').appendTo(ul);
                        
                        $('<a href="' + i + '">' + i + '</a>').appendTo(li).click(function(e){
                              
                              e.preventDefault();
                              pag = $(this).attr('href');
                              self._pag = pag;
                              self._buttonClickPagination(pag, self._limit);
                        });
                              
                  }
                  
                  li = $('<li></li>').appendTo(ul);
                  
                  $('<a href="#"> &rarr; </a>').appendTo(li).click(function(e){
                              
                        e.preventDefault();
                        pag = (self._pag < pagHasta ? self._pag +1 : pagHasta);
                        self._pag = pag;
                        self._buttonClickPagination(pag, self._limit);
                  });
                  
                  li = $('<li></li>').appendTo(ul);
                  
                  $('<a href="'+ pagHasta +'"> Fin </a>').appendTo(li).click(function(e){
                              
                        e.preventDefault();
                        pag = $(this).attr('href');
                        self._pag = pag;
                        self._buttonClickPagination(pag, self._limit);
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
            
            _reloadTable: function(){
                  
                  this._removeTr();
                  this._loadData();
                  this._createTableRows(this._$tableBody);
                  
                  this._$spanPaginate.text('Total de paginas '+ this._totalRows +'');
            },
            
            _removeTr: function(){
                  
                  this._$tableBody.empty();
            }
                  
      });
      
})(jQuery);

;
(function($){
      
      $.extend(true, $.hik.catalogoTable.prototype, {
            
            options: {
                  
                  title : '',
                  actions:{
                        load_url: '',
                        add_url:'',
                        edit_url:'',
                        view_url:'',
                        delete_url:'',
                        reportpdf_url:'',
                        reportexcel_url:''
                  },
                  columns: {},
                  buttons: {},
                  permits:{},
                  messages: {
                        msgServerCommunicationError: 'A ocurrido un error al comunicarse con el servidor.',
                        msgSloading: 'Cargando datos...',
                        msgNoDataAvailable: 'Datos no disponibles!',
                        msgAreYouSure: 'Seguro que desea continuar?',
                        magCannotLoadOptionsFor: 'No se puede cargar los registros {0}',
                        titleError: 'Error',
                        btnClose: 'Cerrar',
                        btnSave: 'Guardar',
                        btnCancel: 'Cancelar'
                  },
                  
                  obj_btnNew:null,
                  
                  obj_divform: {},
                  obj_form:{},
                  obj_divFormSuccess:{},
                  
                  formClose: function(){},
                  formSaveSubmit: function(){},
                  formSaveClick:function(){},
                  
                  formValidationEngine: function(){},
                  
                  formEditSubmit: function(){},
                  formEditClick:function(){}
                  
            },
            
            _$btnNew:null,
            _$btnPdf:null,
            _$btnExcel: null,
            _$btnEdit:null,
            _$btnDelete:null,
            
            _$obj_divform: {},
            _$obj_form: {},
            _$obj_dialog_load: {},
            _$obj_divFormSuccess:{},
            
            _$tableBodyTr: {},
            
            _dataView: null,
            _dataDelete: null,
            
            _$rowsDelete: {},
            
            _initialize: function(){
                  
                  this._$mainContainer = this.element;
                  this._aColumns = [];
                  this._aDataLoad = [];
                  this._totalRows = 0;
                  
                  this._ulPivot = [];
                  this._aPivot = [];
                  
                  this. _aPivotColumn= [];
                  this._aPivotCData= [];
                  this._aSqlPivot = false;
                  this._cPivotAC= 0;
                  this._cPivotACD= 0;
                  
                  this._order = this.options.paginate.order,
                  this._limit = this.options.paginate.limit,
                  this._offset = this.options.paginate.offset,
                  this._campo = this.options.paginate.campo,
                  this._paginaActual = 1;
                  
                  this._$btnNew = (this.options.obj_btnNew != null ? this.options.obj_btnNew : null);
                  this._$btnPdf = (this.options._$btnPdf != null ? this.options._$btnPdf : null);
                  this._$btnExcel = (this.options._$btnExcel != null ? this.options._$btnExcel : null);
                  this._$obj_divform = this.options.obj_divform;
                  this._$obj_form = this.options.obj_form;
                  this._dataEdit = {},
                  this._dataDelete = []
                  this._$obj_divFormSuccess = this.options.obj_divFormSuccess;
            },
            
            _clearForm: function(form){
                  
                  form.find(':input').each(function(){
                        var type = this.type;
                        var tag = this.tagName.toLowerCase();
                        
                        if(type == 'text' || type == 'textarea' || type == 'password'){
                              this.value = '';
                        } else if(type == 'checkbox' || type == 'radio'){
                              this.checked = false;
                        } else if(tag == 'select'){
                              this.selectedIndex = -1;
                        }
                  });
            },
            
            _create: function(){
                  
                  this._construct();
                  this._createGrid();
                  
                  if(this.options.permits.add){
                        this.fnAdd();
                  }
                  
                  if(this.options.permits.view_pdf){
                        this.fnPdf();
                  }
                  
                  if(this.options.permits.view_excel){
                        this.fnExcel();
                  }
                  
            }, 
            
            fnAdd: function(){
                  this.formAddShow();
            },
            
            formAddShow: function(){
                  
                  var self = this;
                  if(self._$btnNew != null){
                        
                        self._$btnNew.click(function(e){
                              e.preventDefault();
                              self.options.formValidationEngine(self._$obj_form);
                              self._$obj_divform.dialog({
                                    autoOpen: true,
                                    modal: true,
                                    title: 'Nuevo',
                                    width: '350px',
                                    buttons: [{
                                          text: self.options.messages.btnSave,
                                          click: function () {
                                          
                                                if(self.options.formSaveClick(self._$obj_form)){
                                                
                                                      self.formSaveSubmit();
                                                } 
                                          }
                                    },{
                                          text: self.options.messages.btnClose,
                                          click: function () {
                                                self.options.formClearAlerts(self._$obj_form);
                                                self._clearForm(self._$obj_form);
                                                self._$obj_divform.dialog('close');
                                          }
                                    }],
                                    close: function(){
                                          self.options.formClearAlerts(self._$obj_form);
                                          self._clearForm(self._$obj_form);
                                    }
                              });
                        });
                  }
                  
            },
            
            formSaveSubmit: function(){
                  
                  var self = this;
                  var dataForm = self._$obj_form.serialize();
                  
                  
                  console.log(dataForm);
                  
                  $.ajax({
                        url: self.options.actions.add_url,
                        type:'POST',
                        data: dataForm,
                        async: false,
                        success: function(data){ 
                              
                              self.formSaveSuccess(data);
                        },
                        error: function(){
                              
                              self.formSaveError();
                        }
                  });
                  
                  self.options.formClearAlerts(self._$obj_form);
                  self._clearForm(self._$obj_form);
            },
            
            formSaveSuccess: function(data){
                  
                  var self = this;
                  var r = $.parseJSON(data);
                  
                  self._reloadTable();
                  
                  var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                  div.text(r.msg).dialog({
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
                  
            },
            
            formSaveError: function(message){
                 
                  var self = this;
                  
                  var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                  div.text(message).dialog({
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
            
            fnView: function(id){
                  
                  this._loadViewData(id);
                  this._formLoadViewData(this._$obj_form);
                  this.formViewShow(id);
            },
            
            _loadViewData: function(id){
                  
                  var self = this;
                  
                  $.ajax({
                        url: self.options.actions.view_url,
                        type:'POST',
                        data:'id='+id,
                        async: false,
                        success: function(data){ 
                              self._viewDataTemp(data);
                        },
                        error: function(){
                              
                              self.formEditError();
                        }
                  });
            },
            
           _viewDataTemp: function(data){
                  
                  var self = this;
                  var r = $.parseJSON(data);
                  
                  if(r.success == true){
                        
                        self._dataView = r.data[0];
                  }
            },
            
            _formLoadViewData: function(form){
                  
                  var self = this;
                  
                  $.each(self._dataView, function(k, v){
                        
                      
                        form.find(':input').each(function(){
                              
                              var t = this;
                              var type = t.type;
                              var tag = t.tagName.toLowerCase();
                              var name = t.name;
                            
                              if(k == name){
                                    
                                    if(type == 'text' || type == 'textarea' || type == 'password'){
                                          t.value = v;     
                                          
                                    } else if(type == 'checkbox' || type == 'radio'){
                                          
                                          t.checked = true;
                                          
                                    } else if(tag == 'select'){
                                          
                                          t.selectedIndex = v;
                                    }
                              }
                        });
                  }); 
            },
            
            formViewShow: function(id){
                  
                  var self = this;  
                  var buttons = [];
                  
                  if(self.options.permits.edit){
                        buttons = [{
                              text: 'Editar',
                              click: function () {
                                          
                                    if(self.options.formSaveClick(self._$obj_form)){
                                          self.fnEdit(id);
                                          self._$obj_divform.dialog('close');
                                    } 
                              }
                        }];
                  }
                   
                  self.options.formValidationEngine(self._$obj_form);
                  self._$obj_divform.dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Ver',
                        width: '350px',
                        buttons: buttons,
                        close: function(){
                              self.options.formClearAlerts(self._$obj_form);
                              self._clearForm(self._$obj_form);
                        }
                  });
            },
            
            fnEdit: function(id){
                  
                  var self = this;
                  var dataForm = self._$obj_form.serialize();
                  
                  $.ajax({
                        url: self.options.actions.edit_url,
                        type:'POST',
                        data: 'id='+id+'&'+dataForm,
                        async: false,
                        success: function(data){ 
                              
                              self.formEditSuccess(data);
                        },
                        error: function(){
                              
                              self.formEditError();
                        }
                  });
            },
            
            formEditSuccess: function(data){
                  
                  var self = this;
                  var r = $.parseJSON(data);
                  self._reloadTable();
                  
                  var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                  div.text(r.msg).dialog({
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
            },
            
            fnDelete: function(id){
                  
                  var self = this;
                  self._delete(id);
            },
            
            _delete: function(id){
                  
                  var self = this;
                  
                  self._$divDialogMsg = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                  self._$divDialogMsg.text('Estas seguro que deceas eliminar este registro.').dialog({
                        autoOpen: true,
                        modal: true,
                        title: 'Atencion',
                        buttons: [{
                              text: 'Aceptar',
                              click: function () {
                                    self._$divDialogMsg.dialog('close');
//                                    self._loadDataDelete();
                                    self._deleteSubmit(id);
                              }
                        },{
                              text: 'Cancelar',
                              click: function () {
                                    self._$divDialogMsg.dialog('close');
                              }
                        }]
                  });
            },
            
            //            _loadDataDelete: function(){
            //                  
            //                  var self = this;
            //                  var check = {};
            //                  var tr = {};
            //                  var rowsDelete = [];
            //                     
            //                  self._$tableBody.find('tr').each(function(){                        
            //                        tr = this; 
            //                        check = $(this).find('.catalog-check-delete');
            //                        if(check.is(':checked')){
            //                              self._dataDelete.push(check.val());
            //                              rowsDelete.push(tr);
            //                        }
            //                  });
            //                  
            //                  self._$rowsDelete = rowsDelete;
            //            },
            
            _deleteSubmit:function(id){
                  
                  var self = this;                 
                  
                  //                  var ids = self._dataDelete.join(',');

                  $.ajax({
                        url: self.options.actions.delete_url,
                        type:'POST',
                        data: 'id='+id,
                        async: false,
                        dataType:'json',
                        success: function(data){ 
                              self._deleteSubmitSuccess(data);
                        },
                        error: function(){
                              self._deleteSubmitError();
                        }
                  });
                        
                 
            },
            
            _deleteSubmitSuccess: function(data){
                  
                  var self = this;
                  //                  var conta = 0;
                  
                  if(data.success){
                        
                        self._reloadTable();
                        var div = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                        div.text('Registro Eliminado').dialog({
                              autoOpen: true,
                              modal: true,
                              title: 'Atencion',
                              buttons: [{
                                    text: self.options.messages.btnClose,
                                    click: function () {
                                          div.dialog('close');
                                    }
                              }]
                        });
                  } else {
                        
                        self._deleteSubmitError(data.msg);
                  } 
                  
            },
            
            _deleteSubmitError: function(msg){
                  
                  var self = this;
                  var message = msg || self.options.messages.msgServerCommunicationError;
                  
                  self._$divDialogMsg = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
                  self._$divDialogMsg.text(message).dialog({
                        autoOpen: true,
                        modal: true,
                        title: self.options.messages.titleError,
                        buttons: [{
                              text: self.options.messages.btnClose,
                              click: function () {
                                    self._$divDialogMsg.dialog('close');
                              }
                        }]
                  });
            },
            
            // esto se penso apra los check en donde se pudiera eliminar mas de uno 
            
            //            _deleteMsgNoCheked: function(){
            //                  
            //                  var self = this;
            //                  
            //                  self.msgNoCheked = $('<div id="catalogo-dialog-msg"></div>').appendTo(this._$mainContainer);
            //                  self.msgNoCheked.text('No hay registros seleccionados para eliminar.').dialog({
            //                        autoOpen: true,
            //                        modal: true,
            //                        title: self.options.messages.titleError,
            //                        buttons: [{
            //                              text: 'Aceptar',
            //                              click: function () {
            //                                    self.msgNoCheked.dialog('close');
            //                              }
            //                        },{
            //                              text:'Cancelar',
            //                              click: function(){
            //                                    self.msgNoCheked.dialog('close');
            //                              }
            //                        }]
            //                  });
            //            }
      
            fnPdf: function(){
                  
                  var self = this;
                  if(self._$btnPdf != null){
                        
                        this._$btnPdf.click(function(){

                              window.open(self.options.actions.reportpdf_url);
                        });
                  }
            },
            
            fnExcel: function(){
                  
                  var self = this;
                  if(self._$btnExcel != null){
                        
                        this._$btnExcel.click(function(){

                              window.open(self.options.actions.reportexcel_url);
                        });
                  }
            }
            
      });
      
})(jQuery);



//      module_roles.init({          
//            load_define: btn_define,
//            load_asigna: btn_asigna,
//            load_options: {
//                  div_library: div_library
//            }
//      }); 
      
//      $("#catalogo-table").catalogoTable({
//         
//            title: 'Tabla de Roles',
//         
//            actions:{
//                  load_url: base_url + 'admin_catalogs/roles/fn_paginate_grid',
//                  load_permits: base_url + 'admin_catalogs/roles/fn_loadpermits_grid',
//                  add_url: base_url + 'admin_catalogs/roles/add',
//                  edit_url: base_url + 'admin_catalogs/roles/edit',
//                  view_url: base_url + 'admin_catalogs/roles/view',
//                  delete_url: base_url + 'admin_catalogs/roles/delete',
//                  reportpdf_url: base_url + 'admin_catalogs/roles/fn_get_pdf_grid',
//                  reportexcel_url: base_url + 'admin_catalogs/roles/fn_get_excel_grid'
//            },
//         
//            permits:{
//                  add: true,
//                  edit:true,
//                  deleted:true,
//                  view:true,
//                  view_pdf:true ,
//                  view_excel:true
//            },
//         
//            paginate:{
//                  order: 'DESC',
//                  campo: 'id',
//                  limit: 5,
//                  offset: 0
//            },
//         
//            columns: {
//            
//                  name:{
//                        title: 'Nombre del Rol',
//                        width: '42%',
//                        sortable: true,
//                        pivot: true,
//                        dataType:'integer'
//                  }, 
//                  create_date: {
//                        title: 'Fecha Creacion',
//                        width: '42%',
//                        sortable: true,
//                        pivot: true,
//                        dataType:'timestamp'
//                  },
//                  actions: {
//                        title: 'Acciones',
//                        widht: '10%'
//                  }
//            },
//         
//            buttons: {
//            
//                  Pdf:{
//                        title: 'Pdf'
//                  },
//                  Excel: {
//                        title: 'Excel'
//                  }
//            },
//         
//            obj_btnNew: btnNew,
//            obj_divform: divForm,
//            obj_form: form,
//            obj_divdialog: divDialog,
//         
//            formValidationEngine: function(form){
//            
//                  form.find('#name').addClass('validate[required]');
//                  form.validationEngine('hideAll');
//                  form.validationEngine({
//                        promptPosition : "bottomLeft", 
//                        scroll: false
//                  });
//                  form.validationEngine();
//            },
//         
//            formSaveClick: function(form){
//                  return form.validationEngine('validate');
//            },
//         
//            formClearAlerts: function(form){   
//                  form.validationEngine('hideAll');
//            },
//         
//            formClose: function(event, f){
//                  f.form.validationEngine('hide');
//                  f.form.validationEngine('detach');
//            },
//         
//            fnAdd: function(form){
//                  
//                 
//            },
//         
//            fnEdit: function(){
//               
//            },
//         
//            fnView: function(){
//               
//            },
//         
//            fnDelete: function(){
//               
//            }
//      });