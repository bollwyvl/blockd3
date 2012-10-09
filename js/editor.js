$(function(){

$('<iframe id="content_blocks" src="./frame.html"></iframe>').appendTo('#content_blockly');    

var blockd3 = window.blockd3 = function(){};

var Blockly;

var editors = blockd3.editors = {
    javascript: undefined,
    xml: undefined
};

var init =  blockd3.init = function(blockly){
    window.Blockly = Blockly = blockly;
    init_blockly(blockly);
    init_editors();
    $('a[href="#' + mode() + '"]').click();
    $(window).resize();
    $("#container").fadeIn();
};
    
var init_blockly = blockd3.init_blockly = function(Blockly) {
    // Make the 'Blocks' tab line up with the toolbox.
    if (Blockly.Toolbox) {
        $(window).on('resize', function() {
            $('.full_height')
                .css("height",
                    $(window).height()
                    - $("#navbar").height()
                    - $("footer").height()
                    - 20
                );
                    
        });
    }

    // Restore/backup current works.
    restore_blocks();

    $(window).unload(backup_blocks)

    // Init load event.
    var loadInput = $('#load')
        .change(load);
        
    $('#load_xml').click(function(evt) {
        loadInput.click();
    });
    
    $("#run").click(run_js);
    $("#save_xml").click(save);
    $("#discard").click(discard);
};
    
var tabs = blockd3.tabs = $("#tabs li")
    .on("click", function(evt){
        var prev = mode(),
            tab = $(this),
            href = tab.find("a").attr('href'),
            pane = $("#content_" + href.slice(1)),
            panes = $(".pane");
        
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
        panes.hide();
        pane.show();
        render_content();
    });
        
var mode = blockd3.mode =function(){
    return $("#tabs li.active a").attr("href").slice(1);
};
    
var exit_xml = blockd3.exit_xml = function(){
    var xmlText = editors.xml.getValue(),
        xmlDom = null;
    try {
        xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
        var conf = window.confirm('Error parsing XML:\n' + e + '\n\nAbandon changes?');
        if (!conf) {
            // Leave the user on the XML tab.
            return;
        }
    }
    if (xmlDom) {
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
    }
};
    
var render_content = blockd3.render_content = function(){
    var current_mode = mode(),
        content = $("#content_" + current_mode);
        
    // Initialize the pane.
    if (current_mode == 'blockly') {
        // If the workspace was changed by the XML tab, Firefox will have performed
        // an incomplete rendering due to Blockly being invisible.  Rerender.
        Blockly.mainWorkspace.render();
    } else if (current_mode == 'xml') {
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace),
            xmlText = Blockly.Xml.domToPrettyText(xmlDom);
            editors.xml.setValue(xmlText);
    } else if (current_mode == 'javascript') {
        editors.javascript.setValue(
            Blockly.Generator.workspaceToCode('JavaScript')
        );
    }
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
var run_js = blockd3.run_js = function() {
    var code = Blockly.Generator.workspaceToCode('JavaScript');
    try {
        eval(code);
    } catch (e) {
        alert('Program error:\n' + e);
    }
};

/**
 * Backup code blocks to localStorage.
 */
var backup_blocks = blockd3.backup_blocks = function() {
    if ('localStorage' in window) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        window.localStorage.setItem('blocks', Blockly.Xml.domToText(xml));
    }
};

/**
 * Restore code blocks from localStorage.
 */
var  restore_blocks = blockd3.restore_blocks = function() {
  if ('localStorage' in window && window.localStorage.blocks) {
    var xml = Blockly.Xml.textToDom(window.localStorage.blocks);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  }
};

/**
 * Save blocks to local file.
 */
var save = blockd3.save = function() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace),
        data = Blockly.Xml.domToText(xml);

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
                xml = Blockly.Xml.textToDom(target.result);
            } catch (e) {
                alert('Error parsing XML:\n' + e);
                return;
            }
        
            var count = Blockly.mainWorkspace.getAllBlocks().length;
            if (count && confirm(
                    'Replace existing blocks?\n"Cancel" will merge.')) {
                        Blockly.mainWorkspace.clear();
                    }
                Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
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
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 || window.confirm(
      'Delete all ' + count + ' blocks?')) {
          Blockly.mainWorkspace.clear();
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


});