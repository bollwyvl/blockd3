(function(CodeMirror, $, _, d3, Tour, BlobBuilder, FileReader, saveAs){
"use strict";

var window = this;

$('<iframe id="content_blocks" src="./frame.html"></iframe>')
    .appendTo('#content_blockly');

var VERSION = [0, 1, 0];

var blockd3 = this.blockd3 = function(){},
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

$("#show_alerts").click(function(){
    $("#alert").fadeToggle();
});

var lert = blockd3.lert = function(text){
    alert_list.prepend("<li>"+alert_time(new Date())+text+"</li>");
    alert_popup.fadeIn();
    $("#show_alerts").fadeIn();
};

blockd3.init = function(blockly){
    init_blockly(blockly);
    init_editors();
    $('a[href="#' + mode() + '"]').click();
    $(window).resize();
    $("#container").fadeIn();
    

    d3.xml(blockly._blockd3_lib + "../../svg/money_problems.svg", "image/svg+xml", function(xml){
        d3.select("#content_d3").node().appendChild(
            document.importNode(xml.documentElement, true)
        );
    });
    
    blockd3.tour().step( 
        "#logo",
            "building data pictures with d3 in blockly",
            "DON'T PANIC"
        ).step(
            "a[href='#javascript']",
                "JavaScript",
                "is kind of hard"
        ).step(
            "a[href='#xml']",
                "XML",
                "is not very prety"
        ).step(
            "a[href='#blockly']",
                "blockly",
                "makes progrmming easy"
        );
    
    $(".brand").click(function(){
        blockd3.tour.start();
    });
};
    
var init_blockly = blockd3.init_blockly = function(Blockly) {
    blockd3.Blockly = Blockly;
    
    // Make the 'Blocks' tab line up with the toolbox.
    if (blockd3.Blockly.Toolbox) {
        $(window).on('resize', function() {
            var fullh = $(window).height() - (
                navbar.height() + footer.height());
            $('.full_height').css("height", fullh - 12);
            $('.half_height, .CodeMirror').css("height", (fullh - 24)/2);
                    
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
    $("#save_xml").click(save);
    $("#discard").click(discard);
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

var step = blockd3.tour.step = function(element, title, content, placement){
    _tour.addStep({
      element: element, /* html element next to which the step popover should be shown */
      title: title, /* title of the popover */
      content: content, /* content of the popover */
      placement: placement || "bottom", // string|function
      animation: true // boolean
    });
    return blockd3.tour;
};

blockd3.tour.start = function(){
    _tour.start(true);
    return blockd3.tour;
};
    
var panes = $(".pane"),
    tabs = blockd3.tabs = $("#tabs li")
    .on("click", function(evt){
        var prev = mode(),
            tab = $(this),
            href = tab.find("a").attr('href') || "",
            pane = $("#content_" + href.slice(1));
        
        switch(prev){
            case "javascript":
                break;
            case "blockly":
                break;
            case "xml":
                exit_xml(); break;
        }
                
        tabs.removeClass("active");
        tab.addClass("active");
        panes.show();
        render_content();
    });

var mode = blockd3.mode = function(){
    return ($("#tabs li.active a").attr("href") || "").slice(1) || "xml";
};
    
var exit_xml = blockd3.exit_xml = function(){
    var xmlText = editors.xml.getValue(),
        xmlDom = null;
    try {
        xmlDom = blockd3.Blockly.Xml.textToDom(xmlText);
    } catch (e) {
        var conf = window.confirm('Error parsing XML:\n' + e + '\n\nAbandon changes?');
        if (!conf) {
            // Leave the user on the XML tab.
            return;
        }
    }
    if (xmlDom) {
        blockd3.Blockly.mainWorkspace.clear();
        blockd3.Blockly.domToWorkspace(blockd3.Blockly.mainWorkspace, xmlDom);
    }
};
    
var render_content = blockd3.render_content = function(){
    var current_mode = mode(),
        content = $("#content_" + current_mode);
        
    // Initialize the pane.
    if (current_mode == 'blockly') {
        // If the workspace was changed by the XML tab, Firefox will have performed
        // an incomplete rendering due to Blockly being invisible.  Rerender.
        blockd3.Blockly.mainWorkspace.render();
    } else if (current_mode == 'xml') {
        var xmlDom = blockd3.Blockly.Xml.workspaceToDom(blockd3.Blockly.mainWorkspace),
            xmlText = blockd3.Blockly.Xml.domToPrettyText(xmlDom);
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
        var xml = blockd3.Blockly.Xml.workspaceToDom(
            blockd3.Blockly.mainWorkspace);
        window.localStorage.setItem('blocks', blockd3.Blockly.Xml.domToText(xml));
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
            $.get(blockd3.Blockly._blockd3_lib + "../../blockml/simplest.xml", function(data, textStatus, jqXHR){
                xml2blocks(jqXHR.responseText);
            });
        }
    }
};

var xml2blocks = blockd3.xml2blocks = function(xml){
    return blockd3.Blockly.Xml.domToWorkspace(
        blockd3.Blockly.mainWorkspace,
        blockd3.Blockly.Xml.textToDom(xml)
    );
};

/**
 * Save blocks to local file.
 */
var save = blockd3.save = function() {
    var xml = blockd3.Blockly.Xml.workspaceToDom(blockd3.Blockly.mainWorkspace),
        data = blockd3.Blockly.Xml.domToText(xml);

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
                xml = blockd3.Blockly.Xml.textToDom(target.result);
            } catch (e) {
                lert('Error parsing XML:\n' + e);
                return;
            }
        
            var count = blockd3.Blockly.mainWorkspace.getAllBlocks().length;
            if (count && confirm(
                    'Replace existing blocks?\n"Cancel" will merge.')) {
                        blockd3.Blockly.mainWorkspace.clear();
                    }
                blockd3.Blockly.Xml.domToWorkspace(blockd3.Blockly.mainWorkspace, xml);
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
  var count = blockd3.Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 || window.confirm(
      'Delete all ' + count + ' blocks?')) {
          blockd3.Blockly.mainWorkspace.clear();
          render_content();
      }
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


var change_theme = blockd3.change_theme = function(evt){
    var tgt = $(evt.target),
        new_theme = tgt.data("blockd3-theme");
    
    if(_.isUndefined(new_theme)){
        new_theme = "";
    }else{
        new_theme = "lib/swatch/bootswatch." + new_theme + ".min.css";
    }
    
    $("#change_theme .active").removeClass("active");
    
    tgt.parent().addClass("active");
    
    $("#theme_link").attr("href", new_theme);
};

}).call(this, CodeMirror, $, _, d3, Tour, BlobBuilder, FileReader, saveAs);