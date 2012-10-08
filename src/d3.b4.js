(function(b4){
    
var D3_WIKI = "https://github.com/mbostock/d3/wiki/",
    D3_TYPES = {
        SELECTION: {
            id: "D3 Selection",
            field: b4.fields.text("SELECTOR")
                .init("CSS-style selector")
        },
        PARENT:{
            id: "D3 Parent Selection",
            field: b4.input("PARENT")
                .title("from")
                .inputValue(true)
        }
    };
    

// set up a base configuration
var d3_mold = b4.block()
    .generator("JavaScript")
    .helpUrlTemplate(D3_WIKI)
    .namespace("")
    .colour("steelBlue"),
            
    // make a subconfiguration
    select_mold = d3_mold.clone()
        .namespace("d3_select")
        .category("d3 selection")
        .output(D3_TYPES.SELECTION)
        .helpUrlTemplate(D3_WIKI +"Selections#wiki-<%= block.id() %>"),
    
    select_arg_mold = select_mold.clone()
        .namespace("d3_d3_")
        .output(D3_TYPES.SELECTION);
            
select_mold.clone("")
    .tooltip("The first element that matches the selector")
    .appendTitle("select the first element that matches")
    .appendTitle(D3_TYPES.SELECTION.field)
    .code("d3.select('<%= $.title('SELECTOR') %>')")
    .done();
        
select_mold.clone("All")
    .tooltip("All elements that match the selection")
    .appendTitle("select all elements that match")
    .appendTitle(D3_TYPES.SELECTION.field)
    .code("d3.selectAll('<%= $.title('SELECTOR') %>')")
    .done();
    
        
select_arg_mold.clone("selectAll")
    .tooltip("All elements that match the selection")
    .appendTitle("select all elements that match")
    .appendTitle(D3_TYPES.SELECTION.field)
    .appendInput(D3_TYPES.PARENT.field)
    .code([
            "<%= $.code('PARENT') %>", 
            ".selectAll('<%= $.title('SELECTOR') %>')"
        ].join("\n\t"))
    .done();
    
select_mold.clone("enter")
    .tooltip("returns placeholders for missing elements")
    .appendTitle("enter")
    .appendInput(D3_TYPES.PARENT.field)
    .code([
            "<%= $.code('PARENT') %>", 
            ".enter()"
        ].join("\n\t"))
    .done();

D3_TYPES.STYLE_PROP = {
    id: "D3 CSS Style Property",
    field: b4.input("STYLE_PROP")
        .inputValue(true)
        .title("CSS property")
};


D3_TYPES.VALUE = {
    id: "D3 general calc value",
    field: b4.input("VALUE")
        .inputValue(true)
        .title("value")
};

d3_mold.clone("style") 
    .appendTitle('style')
    .category("d3 manipulation")
    .appendInput(D3_TYPES.PARENT.field)
    .appendInput(D3_TYPES.STYLE_PROP.field)
    .appendInput(D3_TYPES.VALUE.field)
    .code([
        "<%= $.code('PARENT') %>", 
        ".style(<%= $.code('STYLE_PROP') %>, <%= $.code('VALUE') %>)"
    ].join("\n\t"))
    .done();
        /*

        BL.d3_style = {
          // selection.style - get or set style properties.
          category: 'd3 Selection Transformation',
          helpUrl: doc.selections + 'style',
          init: function() {
            this.setColour(BLOCKD3_COLOR);
            this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
            this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
            this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
            this.setTooltip('Set the CSS style');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
          }
        };

        BJS.d3_style = function() {
            return [
                BJS.valueToCode(this, 'ITEM', BJS.ORDER_NONE),
                '.style("',
                this.getTitleValue('TEXT'),
                '", ',
                BJS.valueToCode(this, 'VALUE', BJS.ORDER_NONE),
                ');\n'
              ].join("");
        };
        */
})(b4);