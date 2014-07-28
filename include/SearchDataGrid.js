// settings for loading dojo modules
var dojoConfig = {async: true, parseOnLoad: false};

function SearchDataGrid(div_id, name, fields) {

    this.div_id = div_id;

    this.frame_div_id = div_id + '_frame_div';

    this.grid_div_id = div_id + '_grid';

    this.search_div_id = div_id + '_search_div';
    this.search_id = div_id + '_search_id';

    this.button_div_id = div_id + '_button_div';
    this.add_id = div_id + '_add_id';
    this.remove_id = div_id + '_remove_id';

    this.name = name;
    this.fields = fields;

    this.layout = [];

    this.data = "";

    this.provider = null;
    this.store = null;
    this.grid = null;

    this.filter = "";

    var search_grid = this;

    dojo.require("dojox.storage");

    dojo.addOnLoad(function() {
        require(
            ['dojox/grid/DataGrid', 'dojox/data/AndOrWriteStore', 'dojo/json'],
            function(DataGrid, AndOrWriteStore, JSON) {
                search_grid.setProvider();
                search_grid.getData();

                search_grid.setLayout();
                search_grid.setGrid(DataGrid, AndOrWriteStore, JSON);

                search_grid.startup();
            }
        );
    });
}

SearchDataGrid.prototype.setProvider = function() {
    this.provider = dojox.storage.manager.getProvider();
    this.provider.initialize(); 
}

SearchDataGrid.prototype.getData = function() {
    this.data = this.provider.get(this.name)
    this.validateData();
}

SearchDataGrid.prototype.validateData = function() {
    var i;
    var key;

    if (!this.data || !this.data.items || !Array.isArray(this.data.items)) {
        this.data = {items: []};
        return;
    }
}

SearchDataGrid.prototype.setLayout = function() {
    var i;

    if (this.fields && Array.isArray(this.fields)) {
        this.layout = [];

        for(i = 0; i < this.fields.length; i++) {
           this.layout[i] = {};
           this.layout[i]['name'] = this.fields[i];
           this.layout[i]['field'] = this.fields[i];
           this.layout[i]['width'] = '' + parseInt(100 / this.fields.length)
                                     + '%';
           this.layout[i]['editable'] = true;
        }
    }
}

SearchDataGrid.prototype.setGrid = function() {
    var search_grid = this;

    require(
        ['dojox/grid/DataGrid', 'dojox/data/AndOrWriteStore', 'dojo/json'],
        function(DataGrid, AndOrWriteStore, JSON) {
            search_grid.store = new AndOrWriteStore({data: search_grid.data});
            search_grid.store._saveEverything = function(saveComplete,
                                                         saveFailed,
                                                         content) {
                search_grid.data = JSON.parse(content);
                search_grid.provider.put(search_grid.name, search_grid.data,
                                         function(status, keyName) {});

                saveComplete();
            };

            search_grid.grid = new DataGrid({
                id: "grid" + search_grid.name,
                store: search_grid.store,
                structure: search_grid.layout,
                rowSelector: "20px"
            });

            dojo.connect(search_grid.grid, 'onApplyEdit', function() {
                search_grid.store.save();
                search_grid.applyFilter();
            });
        }
    );
}

SearchDataGrid.prototype.applyFilter = function() {
    var i;
    var _filter = dojo.byId(this.search_id).value;

    this.filter = "";
    for(i = 0; i < this.fields.length; i++)
        this.filter = this.filter + " OR " + this.fields[i] + ":'*" +
                      _filter + "*'";

    this.filter = this.filter.substring(4);

    this.grid.filter({complexQuery: this.filter});
}

SearchDataGrid.prototype.addNewItem = function() {
    var i;
    var newItem = {};

    for (i = 0; i < this.fields.length; i++)
        newItem[this.fields[i]] = "";

    this.store.newItem(newItem);
    this.store.save();
}

SearchDataGrid.prototype.removeSelectedItems = function() {
    var items = this.grid.selection.getSelected();
    var search_grid = this;

    if (items.length)
        require(['dojo/_base/array'], function(array) {
            array.forEach(items, function(selectedItem) {
                if (selectedItem !== null)
                    search_grid.store.deleteItem(selectedItem);
            });
        });

    this.store.save();
}

SearchDataGrid.prototype.startup = function() {
    var search_grid = this;

    dojo.create("div", {id: this.frame_div_id, class: "sgd_frame_div"},
                       dojo.byId(this.div_id));

    dojo.create("div", {id: this.search_div_id, class: "sgd_search_div"},
                       dojo.byId(this.frame_div_id));
    dojo.create("input", {id: this.search_id, class: "sgd_search"},
                         dojo.byId(this.search_div_id));

    dojo.create("div", {id: this.button_div_id, class: "sgd_button_div"},
                       dojo.byId(this.frame_div_id));
    dojo.create("input", {id: this.add_id, class: "sgd_add",
                          type: "button", value: "+"},
                          dojo.byId(this.button_div_id));
    dojo.create("input", {id: this.remove_id, class: "sgd_remove",
                          type: "button", value: "-"},
                          dojo.byId(this.button_div_id));

    dojo.create("div", {class: "sgd_grid_div claro", id: this.grid_div_id},
                dojo.byId(this.frame_div_id));

    dojo.connect(dojo.byId(this.search_id), "onchange", function() {
        search_grid.applyFilter();
    });

    dojo.connect(dojo.byId(this.add_id), "onclick", function() {
        search_grid.addNewItem();
    });

    dojo.connect(dojo.byId(this.remove_id), "onclick", function() {
        search_grid.removeSelectedItems();
    });

    this.grid.placeAt(this.grid_div_id);
    this.grid.startup();
}