(function(b4){
"use strict";
var D3_WIKI = "https://github.com/mbostock/d3/wiki/",
    SELECTION = {
        id: String,
        field: b4.input("SELECTOR")
            .inputValue(true)
            .title("CSS-style selector")
    },
    PARENT = {
        id: String,
        field: b4.input("PARENT")
            .title("of selection")
            .inputValue(true)
    },
    ELEMENT = {
        id: "ELEMENT",
        field: b4.fields.choices("ELEMENT")
            .title("SVG Element")
            .init([
                ["rectangle", "rect"],
                ["circle", "circle"],
                ["ellipse", "ellipse"],
                ["line", "line"],
                ["polyline", "polyline"],
                ["polygon", "polygon"],
                ["text", "text"],
                ["path", "path"]
            ])
    },
    ATTR_PROP = {
        id: String,
        field: b4.input("ATTR_PROP")
            .inputValue(true)
            .title("DOM attribute")
    },
    STYLE_PROP = {
        id: String,
        field: b4.input("STYLE_PROP")
            .inputValue(true)
            .title("CSS property")
    },
    VALUE = {
        id: true,
        field: b4.input("VALUE")
            .inputValue(true)
            .title("to value")
    },
    KLASS = {
        id: String,
        field: b4.input("KLASS")
            .inputValue(true)
            .title("CSS class")
    },
    PROP = {
        id: String,
        field: b4.input("PROP")
            .inputValue(true)
            .title("property named")
    },
    ENTITY = {
        id: String,
        field: b4.input("ENTITY")
            .inputValue(true)
            .title("tag named")
    },
    CHAIN = {
        id: true,
        field: b4.input("CHAIN")
            .nextStatement(true)
            .title("and then")
    };
    

// set up a base configuration
var d3_mold = b4.block()
    .generator("JavaScript")
    .helpUrlTemplate(D3_WIKI)
    .namespace("")
    .colour("steelblue")
    .codeOrder(1)
    .parenthesize(false),
            
    // make a subconfiguration
    select_mold = d3_mold.clone()
        .namespace("d3_select")
        .category("d3 selection")
        .output(SELECTION)
        .helpUrlTemplate(D3_WIKI +"Selections#wiki-<%= block.id() %>"),
    
    select_arg_mold = select_mold.clone()
        .namespace("d3_d3_")
        .output(SELECTION);



            
select_mold.clone("")
    .tooltip("The first element that matches the selector")
    .appendTitle(["select the first element that matches"])
    .appendInput([SELECTION, CHAIN])
    .code("d3.select(<%= $.code('SELECTOR') %>)<%= $.code('CHAIN') %>")
    .done();
        
select_mold.clone("All")
    .tooltip("All elements that match the selection")
    .appendTitle(["select all elements that match"])
    .appendInput([SELECTION, CHAIN])
    .code("d3.selectAll(<%= $.code('SELECTOR') %>)<%= $.code('CHAIN') %>")
    .done();
    

// d3.select("svg").selectAll("rect").style("fill", "blue")

select_arg_mold.clone("selectAll")
    .tooltip("All elements that match the selection")
    .appendTitle(["select all elements that match"])
    .appendInput([SELECTION,
        PARENT])
    .code([
            "<%= $.code('PARENT', 'd3.select(\"svg\")') %>", 
            ".selectAll(<%= $.code('SELECTOR') %>)"
        ])
    .done();
    
select_mold.clone("enter")
    .tooltip("returns placeholders for missing elements")
    .appendTitle("enter")
    .appendInput(PARENT)
    .code(["<%= $.code('PARENT') %>", 
            ".enter()"])
    .done();



var manip_mold = d3_mold.clone()
        .category("d3 manipulation")
        .namespace("d3_")
        .previousStatement(true)
        .nextStatement(true)
        .inputsInline(true);
    
manip_mold.clone("style") 
    .appendTitle("set d3.style")
    .appendInput([STYLE_PROP,
        VALUE])
    .code([".style(<%= $.code('STYLE_PROP') %>, <%= $.code('VALUE') %>)"])
    .done();
    

manip_mold.clone("attr")
    .tooltip("Set the SVG attribute")
    .appendTitle("d3.attr")
    .appendInput([ATTR_PROP,
        VALUE])
    .code(".attr(<%= $.code('ATTR_PROP') %>, <%= $.code('VALUE') %>)")
    .done();
    
manip_mold.clone("data")
    .tooltip("Set the data for a selection")
    .appendTitle("d3.data")
    .appendInput(VALUE)
    .code([".data(<%= $.code('VALUE') %>)"])
    .done();

manip_mold.clone("classed")
    .tooltip("Set the class of a selection")
    .appendTitle("d3.class")
    .appendInput([KLASS,
        VALUE])
    .code(".classed(<%= $.code('KLASS') %>, <%= $.code('VALUE') %>)")
    .done();
    
manip_mold.clone("property")
    .tooltip("get or set raw properties")
    .appendTitle("d3.property")
    .appendInput([PROP,
        VALUE])
    .code(".property(<%= $.code('PROP') %>, <%= $.code('VALUE') %>)")
    .done();

manip_mold.clone("text")
    .tooltip("get or set text")
    .appendTitle("d3.text")
    .appendInput([VALUE])
    .code(".text(<%= $.code('VALUE') %>)")
    .done();
    
manip_mold.clone("append")
    .tooltip("get or set html")
    .appendTitle("d3.append")
    .appendInput([ENTITY])
    .code(".append(<%= $.code('ENTITY') %>)")
    .done();

manip_mold.clone("insert")
    .tooltip("create and insert new elements before existing elements")
    .appendTitle("d3.insert")
    .appendInput([PARENT,
        ENTITY])
    .code(".insert(<%= $.code('ENTITY') %>)")
    .done();
    
manip_mold.clone("remove")
    .tooltip("remove elements from the document")
    .appendTitle("d3.remove")
    .appendInput([PARENT,
        ENTITY])
    .code(".remove()")
    .done();
    
    
var svg_mold = b4.block()
    .category("d3 SVG")
    .generator("JavaScript")
    .helpUrlTemplate(D3_WIKI+"SVG-Shapes#wiki-")
    .namespace("d3_svg_elements_")
    .colour("orange")
    .output(null);

svg_mold.clone("element")
    .tooltip("an SVG element")
    .appendTitle(["SVG element", ELEMENT])
    .code("'<%= $.title('ELEMENT') %>'")
    .done();

})(b4);