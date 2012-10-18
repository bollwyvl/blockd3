;(function(d3, b4){
var root = this,
    GOOGLE_KEY = {
        id: String,
        field: b4.input("GOOGLE_KEY")
            .inputValue(true)
            .title("a Google spreadsheet with key")
    },
    ID_CHOICE = {
        id: "ID_CHOICE",
        field: b4.fields.choices("ID_CHOICE")
            .init(function(){
                return enum_selected("*", "id");
            })
    },
    KLASS_CHOICE = {
        id: "KLASS_CHOICE",
        field: b4.fields.choices("KLASS_CHOICE")
            .init(function(){
                return enum_selected("*", "class");
            })
    },
    COL_NAME = {
        id: "COL_NAME",
        field: b4.fields.text("COL_NAME")
            .init("problems")
    },
    CHAIN = {
        id: true,
        field: b4.input("CHAIN")
            .nextStatement(true)
            .title("")
    },
    ROWS_VAR = {
        id: "ROWS_VAR",
        field: b4.fields.variable("ROWS_VAR")
            .init("rows")
    };

var enum_selected = function(selector, attr_name){
    var result,
        def_result = [[attr_name, attr_name]],
        selection;
    if (b4.plugins && b4.plugins.blockd3.get_selection){
        selection = b4.plugins.blockd3.get_selection();
    }
    if(selection){
        result = _($(selection).find(selector))
            .chain()
            .map(function(elem){
                return elem.attributes[attr_name] ? elem.attributes[attr_name].value : undefined; 
            })
            .compact()
            .sortBy(function(x){
                return x;
            })
            .uniq()
            .map(function(attr_val){ return [attr_val, attr_val]; })
            .value();
            result = result.length ? result : def_result;
    }
                
    result = result ? result : [[attr_name, attr_name]];
                
    return result;
};

var blockd3_mold = b4.block()
    .category("blockd3")
    .generator("JavaScript")
    .namespace("blockd3_")
    .colour("orange")
    .output(null);
  
blockd3_mold.clone("id")
    .tooltip("an element with an id")
    .appendTitle(["element with id", ID_CHOICE])
    .code("'#<%= $.title('ID_CHOICE') %>'")
    .done();
  
blockd3_mold.clone("class")
    .tooltip("an element with a class")
    .appendTitle(["element with class", KLASS_CHOICE])
    .code("'.<%= $.title('KLASS_CHOICE') %>'")
    .done();

blockd3_mold.clone("google_spreadsheet")
    .tooltip("fetch a Google Spreadheet")
    .output(false)
    .appendTitle(["fetch into", ROWS_VAR])
        .appendInput([GOOGLE_KEY, CHAIN])
        .code("d3.csv('https://docs.google.com/spreadsheet/pub?key=<%= $.code('GOOGLE_KEY').slice(2,-2) %>&single=true&gid=0&output=csv', function(<%= $.title('ROWS_VAR') %>){\n<%= $.code('CHAIN') %>\n})")
        .done();

blockd3_mold.clone("column")
    .tooltip("a column value")
    .appendTitle(["of row's", COL_NAME])
    .code("function(datum, idx){ return datum['<%= $.title('COL_NAME') %>']; }")
    .done();

}).call(this, d3, b4);