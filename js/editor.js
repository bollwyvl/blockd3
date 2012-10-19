(function(CodeMirror, $, _, d3, Tour, BlobBuilder, FileReader, saveAs){
"use strict";

var window = this;

$('<iframe id="content_blocks" src="./frame.html"></iframe>')
    .appendTo('#content_blockly');

var VERSION = [0, 1, 0];

var blockd3 = window.blockd3 = function(){},
    DEBUG = blockd3.debug = false;

blockd3.VERSION = VERSION.join(".");


var alert_popup = $("#alert"),
    alert_list = $("#alert ul"),
    alert_time = d3.time.format("<i>%H:%M:%S</i> "),
    navbar = $("#navbar"),
    footer = $("footer");

var editors = blockd3.editors = {
    javascript: undefined,
    xml: undefined
};

$("#alert button.close").click(function(){alert_popup.fadeOut();});
$("#show_about").click(function(){
    $("#travis_placeholder")
        .fadeOut()
        .attr("src", "//secure.travis-ci.org/bollwyvl/blockd3.png")
        .fadeIn();
});


$("#show_alerts").click(function(){
    $("#alert").fadeToggle();
});

var lert = blockd3.lert = function(text){
    alert_list.prepend("<li>"+alert_time(new Date())+text+"</li>");
    alert_popup.fadeIn();
    $("#show_alerts").fadeIn();
};

blockd3.init = function(blockly, b4){
    init_blockly(blockly, b4);
    init_editors();
    $('a[href="#' + mode() + '"]').click();
    $(window).resize();
    $("#container").fadeIn();
    

    d3.xml(blockly._blockd3_lib + "../../svg/money_problems.svg", "image/svg+xml", function(xml){
        d3.select("#content_d3").node().appendChild(
            window.document.importNode(xml.documentElement, true)
        );
    });
    
    blockd3.tour().step("#logo",
            "Build Data Pictures Visually",
            "With d3 and Blockly."
        ).step("#content_d3",
            "Building Beautiful Visualizations",
            "... doesn't need to be hard",
            "left"
        ).step("#content_javascript",
            "Learning JavaScript",
            "... can be kind of hard",
            "top"
        ).step("#content_blockly",
            "Blockly Makes Programming Easy",
            "... by helping you know what to say next",
            "right"
        ).step("#load_menu",
            "Try Out Some Examples",
            "... to se what blockd3 can do",
            "bottom",
            true
        ).step("a[href='#example']:last",
            "Here, take this data",
            "... take a look at loading up some spreadsheet data",
            "right",
            true
        );
    
    $(".brand").click(function(){
        blockd3.tour.start();
    });
};
    
var init_blockly = blockd3.init_blockly = function(Blockly, b4) {
    blockd3.Blockly = Blockly;
    blockd3.BMW = Blockly.mainWorkspace;
    blockd3.BMX = Blockly.Xml;
    
    b4.plugins.blockd3 = {
        get_selection: function(){
            return $("svg").get(0);
        }
    };
    
    if (blockd3.Blockly.Toolbox) {
        $(window).on('resize', function() {
            var fullh = $(window).height() - (
                navbar.height() + footer.height()
            );
            $('.full_height').css("height", fullh - 20);
            $('.half_height, .CodeMirror').css("height", (fullh - 380));
            $("#container").css("margin-top", navbar.height());
        });
    }

    // Restore/backup current works.
    restore_blocks();

    $(window).unload(backup_blocks);

    // Init load event.
    var loadInput = $('#load')
        .change(load);
        
    $('#load_xml').click(function(evt) {
        loadInput.click();
    });
    
    $("#run").click(run_js);
    $("#change_theme a").click(change_theme);
    $("a[href='#example']").click(function(evt){ load_example(evt.target); });
    $("#save_xml").click(save);
    $("#discard").click(discard);
    $("#discard_confirm .btn-danger").click(function(){
        blockd3.BMW.clear();
        render_content();
    });
    init_scroll();

    blockd3.Blockly.bindEvent_(
        blockd3.BMW.getCanvas(),
        'blocklyWorkspaceChange', null, function(){
            editors.javascript.setValue(
                blockd3.Blockly.Generator.workspaceToCode('JavaScript')
            );
        });
};

var _tour;

var tour = blockd3.tour = function(value){
    if(_.isUndefined(value)){
        if(_.isUndefined(_tour)){
            _tour = new Tour();
        }
    }else{
        _tour = value;
    }
    return blockd3.tour;
};

var step = blockd3.tour.step = function(element, title, content, placement,
         reflex, on_hide){
    _tour.addStep({
      element: element, /* html element next to which the step popover should be shown */
      title: title, /* title of the popover */
      content: content, /* content of the popover */
      placement: placement || "bottom", // string|function
      animation: true, // boolean
      reflex: reflex || false, //clicky clicky
      onHide: on_hide || function(){}
    });
    return blockd3.tour;
};

blockd3.tour.start = function(){
    _tour.restart();
    return blockd3.tour;
};
    
var panes = $(".pane"),
    tabs = blockd3.tabs = $("#tabs li")
    .on("click", function(evt){
        var prev = mode(),
            tab = $(this),
            href = tab.find("a").attr('href') || "",
            pane = $("#content_" + href.slice(1));
        
        tabs.removeClass("active");
        tab.addClass("active");
        panes.show();
        render_content();
    });

var mode = blockd3.mode = function(){
    return ($("#tabs li.active a").attr("href") || "").slice(1) || "xml";
};
    
var render_content = blockd3.render_content = function(){
    var current_mode = mode(),
        content = $("#content_" + current_mode);
        
    // Initialize the pane.
    if (current_mode == 'blockly') {
        // If the workspace was changed by the XML tab, Firefox will have performed
        // an incomplete rendering due to Blockly being invisible.  Rerender.
        blockd3.BMW.render();
    } else if (current_mode == 'xml') {
        var xmlDom = blockd3.BMX.workspaceToDom(blockd3.BMW),
            xmlText = blockd3.BMX.domToPrettyText(xmlDom);
            editors.xml.setValue(xmlText);
    } else if (current_mode == 'javascript') {
        editors.javascript.setValue(
            blockd3.Blockly.Generator.workspaceToCode('JavaScript')
        );
    }
};

blockd3._running = false;

var running = blockd3.running = function(value){
    var result;
    
    if(_.isUndefined(value)){
        DEBUG && console.log("asked for running: ", blockd3._running);
        
        result = blockd3._running;
    }else{
        DEBUG && console.log("set running to", value);
        blockd3._running = value;
    }
    
    if(blockd3._running){
        $("#stop").show();
        $("#run").hide();
    } else{
        $("#stop").hide();
        $("#run").fadeIn();
    }
    return result;
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
var run_js = blockd3.run_js = function() {
    var code = [
            "var __blockly__wrapper = function(start_cb, end_cb){",
            "start_cb();",
            blockd3.Blockly.Generator.workspaceToCode('JavaScript'),
            "end_cb();",
            "}; __blockly__wrapper;"
        ].join("\n");
    
        try {
            eval(code)(
                function(){blockd3.running(true);},
                function(){blockd3.running(false);}
            );
        } catch (e) {
            lert('Program error:\n' + e);
            blockd3.running(false);
        }
};

/**
 * Backup code blocks to localStorage.
 */
var backup_blocks = blockd3.backup_blocks = function() {
    if ('localStorage' in window) {
        var xml = blockd3.BMX.workspaceToDom(
            blockd3.BMW);
        window.localStorage.setItem('blocks', blockd3.BMX.domToText(xml));
    }
};

/**
 * Restore code blocks from localStorage.
 */
var restore_blocks = blockd3.restore_blocks = function() {
    var wls = window.localStorage;
     
    if (!_.isUndefined(wls)){
        if(!_.isUndefined(wls.blocks) && wls.blocks != "<xml></xml>") {
            xml2blocks(wls.blocks);
        }else{
            setTimeout(blockd3.tour.start, 1000);
        }
    }
};

var xml2blocks = blockd3.xml2blocks = function(xml){
    blockd3.BMX.domToWorkspace(
        blockd3.BMW,
        blockd3.BMX.textToDom(xml)
    );
    blockd3.BMW.scrollbar.resize();
};

/**
 * Save blocks to local file.
 */
var save = blockd3.save = function() {
    var xml = blockd3.BMX.workspaceToDom(blockd3.BMW),
        data = blockd3.BMX.domToText(xml);

    // Store data in blob.
    var builder = new BlobBuilder();
    builder.append(data);
    saveAs(builder.getBlob('text/plain;charset=utf-8'), 'block.xml');
};

/**
 * Load blocks from local file.
 */
var load = blockd3.load = function(evt) {
    var files = evt.target.files;
    // Only allow uploading one file.
    if (files.length != 1) {
        return;
    }

    // FileReader
    var reader = new FileReader();
    reader.onloadend = function(event) {
        var target = event.target,
            xml;
        // 2 == FileReader.DONE
        if (target.readyState == 2) {
            try {
                xml = blockd3.BMX.textToDom(target.result);
            } catch (e) {
                lert('Error parsing XML:\n' + e);
                return;
            }
        
            var count = blockd3.BMW.getAllBlocks().length;
            if (count && confirm(
                    'Replace existing blocks?\n"Cancel" will merge.')) {
                        blockd3.BMW.clear();
                    }
                blockd3.BMX.domToWorkspace(blockd3.BMW, xml);
            }
            // Reset value of input after loading because Chrome will not fire
            // a 'change' event if the same file is loaded again.
            $('#load').val('');
    };
    reader.readAsText(files[0]);
};



/**
 * Discard all blocks from the workspace.
 */
var discard = blockd3.discard = function() {
  var count = blockd3.BMW.getAllBlocks().length;
  $(".block_count").text(count + " block" + (count == 1 ? "" : "s"));
  $("#discard_confirm").modal().show();
  /*
  if (count < 2 || window.confirm(
      'Delete all ' + count + ' blocks?')) {
      }
      */
};


var init_editors = blockd3.initialize_editors = function(){
    _.map(editors, function(editor, language){
        if(!_.isUndefined(editor)){
           return;
        }
        editor = editors[language] = CodeMirror.fromTextArea(
            $("#textarea_"+language)[0],
            {
                lineNumbers: true,
                matchBrackets: true,
                mode: language,
                lineWrapping: true,
                readOnly: true,
                theme: "elegant"
            });
                
        editor.setSize("100%", "100%");
    });
};

var load_example = blockd3.load_example = function(target){

    var tgt = $(target),
        new_example = "blockml/" + tgt.data("blockd3-example") + ".xml";
        
    $.get(new_example, function(data, textStatus, jqXHR){
        xml2blocks(jqXHR.responseText);
    });
};

var change_theme = blockd3.change_theme = function(evt){
    var tgt = $(evt.target),
        new_theme = tgt.data("blockd3-theme");
    
    if(_.isUndefined(new_theme) || !new_theme){
        new_theme = "";
    }else{
        new_theme = "lib/swatch/bootswatch." + new_theme + ".min.css";
    }
    
    $("#change_theme .active").removeClass("active");
    
    tgt.parent().addClass("active");
    
    $("#theme_link").attr("href", new_theme);

    $(window).resize();
};

var init_scroll = function(){
    var is_meta = false;

    function ctrl_check(e) {
        if (e.which === 17 || e.which === 16 || e.which === 91) {
            is_meta = e.type === 'keydown' ? true : false;
        }
    }

    function wheel_check(e, delta) {
        // `delta` will be the distance that the page would have scrolled;
        // might be useful for increasing the SVG size, might not
        e.preventDefault();
        
        delta = delta * 10;
        
        var metrics = blockd3.BMW.scrollbar.getMetrics_(),
            x = -blockd3.BMW.scrollX - metrics.contentLeft ,
            y = -blockd3.BMW.scrollY - metrics.contentTop;
            
            
        blockd3.BMW.scrollbar.set(
            x - (is_meta ? delta : 0),
            y - (is_meta ? 0 : delta));
    }

    $(document)
        .keydown(ctrl_check)
        .keyup(ctrl_check)
        .mousewheel(wheel_check);
}

}).call(this, CodeMirror, $, _, d3, Tour, BlobBuilder, FileReader, saveAs);