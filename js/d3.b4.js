(function(b4, $, _){
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

    /*
    poly(k) - raises t to the specified power k (e.g., 3).
    elastic(a, p) - simulates an elastic band; may extend slightly beyond 0 and 1.
    back(s) - simulates backing into a parking space.
    */
    EASE = {
        id: "EASE",
        field: b4.fields.choices("EASE")
            .title("ease by")
            .init([
                ["the identity function, t", "linear"],
                ["the trigonometric function sin.", "sin"],
                ["raising 2 to a power based on t.", "exp"],
                ["simulating a bouncy collision", "bounce"],
                ["raising to the second power", "quad"],
                ["raising to the third power", "cubic"],
                ["the quarter circle", "circle"]
            ])
    },
    EASE_EXTRA = {
        id: "EASE_EXTRA",
        field: b4.fields.choices("EASE_EXTRA")
            .title("modified by")
            .init([
                ["nothing", ""],
                ["the identity function", "-in"],
                ["reversing the easing direction to [1,0].", "-out"],
                ["copying and mirroring from [0,.5] and [.5,1].", "-in-out"],
                ["copying and mirroring from [1,.5] and [.5,0].", "-out-in"]
            ])
    },
    ID = {
        id: "ID",
        field: b4.fields.choices("ID")
            .title("modified by")
            .init(function(){
                var result;
                
                if (b4.plugins && b4.plugins.d3.get_svg){
                    result = _($(b4.plugins.d3.get_svg()).find("*"))
                        .chain()
                        .pluck("id")
                        .compact()
                        .map(function(id){ return [id, id]; })
                        .value();
                }
                
                return result || [["",""]];
            })
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
            .title("")
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

var trans_mold = d3_mold.clone()
    .namespace("d3_")
    .category("d3 animation")
    .previousStatement(true)
    .helpUrlTemplate(D3_WIKI +"Transitions#wiki-<%= block.id() %>");
    
trans_mold.clone("transition")
    .tooltip("Animate")
    .appendTitle("animate the change of")
    .appendInput(CHAIN)
    .code("\n.transition()<%= $.code('CHAIN') %>")
    .done();
    
trans_mold.clone("delay")
    .tooltip("length of the animation")
    .appendTitle("over")
    .appendInput(VALUE)
    .nextStatement(true)
    .code("\n\t.delay(<%= $.code('VALUE') %>)")
    .done();


trans_mold.clone("ease")
    .tooltip("ease the animation")
    .appendTitle(["ease", EASE, EASE_EXTRA])
    .nextStatement(true)
    .code("\n\t.ease('<%= $.title('EASE') %><%= $.title('EASE_EXTRA') %>')")
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
    .code(["\n\t.style(<%= $.code('STYLE_PROP') %>, <%= $.code('VALUE') %>)"])
    .done();
    

manip_mold.clone("attr")
    .tooltip("Set the SVG attribute")
    .appendTitle("d3.attr")
    .appendInput([ATTR_PROP,
        VALUE])
    .code("\n\t.attr(<%= $.code('ATTR_PROP') %>, <%= $.code('VALUE') %>)")
    .done();
    
manip_mold.clone("data")
    .tooltip("Set the data for a selection")
    .appendTitle("d3.data")
    .appendInput(VALUE)
    .code(["\n\t.data(<%= $.code('VALUE') %>)"])
    .done();

manip_mold.clone("classed")
    .tooltip("Set the class of a selection")
    .appendTitle("d3.class")
    .appendInput([KLASS,
        VALUE])
    .code("\n\t.classed(<%= $.code('KLASS') %>, <%= $.code('VALUE') %>)")
    .done();
    
manip_mold.clone("property")
    .tooltip("get or set raw properties")
    .appendTitle("d3.property")
    .appendInput([PROP,
        VALUE])
    .code("\n\t.property(<%= $.code('PROP') %>, <%= $.code('VALUE') %>)")
    .done();

manip_mold.clone("text")
    .tooltip("get or set text")
    .appendTitle("d3.text")
    .appendInput([VALUE])
    .code("\n\t.text(<%= $.code('VALUE') %>)")
    .done();
    
manip_mold.clone("append")
    .tooltip("get or set html")
    .appendTitle("d3.append")
    .appendInput([ENTITY])
    .code("\n\t.append(<%= $.code('ENTITY') %>)")
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
    .code("\n\t.remove()")
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
  
svg_mold.clone("id")
    .tooltip("an element with an id")
    .appendTitle(["element with id", ID])
    .code("'#<%= $.title('ID') %>'")
    .done();


})(b4, $, _);