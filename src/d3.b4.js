(function(b4){
    
    var D3_WIKI = "https://github.com/mbostock/d3/wiki/",
        D3_TYPES = {
            SELECTION: {
                id: "D3 Selection",
                field: b4.field.text("SELECTOR")
                    .init("CSS-style selector")
            }
        };
    

    // set up a base configuration
    var d3_mold = b4.block()
            .generator("JavaScript")
            .helpUrlTemplate(D3_WIKI)
            .namespace("")
            .colour("blue"),
            
        // make a subconfiguration
        select_mold = d3_mold.clone()
            .namespace("d3_select")
            .helpUrlTemplate(D3_WIKI +"Selections#wiki-<%= block.id() %>")
            .category("d3 Selection");
            
        select_mold.clone("")
            .appendTitle("select the first element that matches")
            .appendTitle(D3_TYPES.SELECTION.field)
            .tooltip("The first element that matches the selector")
            .output(D3_TYPES.SELECTION)
            .code("d3.select('<%= block.getTitleValue('SELECTOR') %>')")
            .done();
        
            //select_mold.clone("All")
            //    .appendTitle("select all elements that match")
})(b4);