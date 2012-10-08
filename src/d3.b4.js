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
        .category("d3 Selection")
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
        .inputsInline(false)
        .code([
                "<%= $.code('PARENT') %>", 
                ".selectAll('<%= $.title('SELECTOR') %>')"
            ].join("\n\t"))
        .done();
})(b4);